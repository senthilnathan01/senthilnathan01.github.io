# Gated Linear Attention: From the Core Idea to Hardware-Efficient Training

**Based on:** "Gated Linear Attention Transformers with Hardware-Efficient Training" by Yang et al. (ICML 2024) [[arXiv:2312.06635](https://arxiv.org/abs/2312.06635)]

This is the longer companion to the short GLA note. The short version says what GLA is. This one answers the harder question:

**How do you train this thing fast and stably on a GPU without turning it into a slow, memory-hungry mess?**

That is the real contribution of the paper.

The model idea itself is not too scary:

$$
S_t = \operatorname{Diag}(\alpha_t)\, S_{t-1} + k_t^T v_t, \qquad o_t = q_t S_t
$$

The trouble begins when you try to train it at scale.

- The recurrence is sequential.
- The obvious parallel form is numerically unstable.
- The obvious backward pass wants to store too many hidden states.

The paper solves those three problems with:

1. chunkwise parallelism,
2. a second level of chunking to recover tensor-core-friendly matmuls,
3. a clever gradient formula that avoids materializing every hidden state.

If the paper felt like it went from "nice recurrence" to "hello Triton kernel" a bit too fast, that is exactly what this article is meant to fix.

---

## 1. Quick Recap: Why Plain Linear Attention Is Not Enough

For standard causal linear attention with the identity feature map, the recurrence is:

$$
S_t = S_{t-1} + k_t^T v_t, \qquad o_t = q_t S_t
$$

Here:

- $S_t \in \mathbb{R}^{d_k \times d_v}$ is the matrix memory state
- $k_t^T v_t \in \mathbb{R}^{d_k \times d_v}$ is the new write
- $q_t S_t \in \mathbb{R}^{1 \times d_v}$ is the readout

This is already nice because sequence length enters linearly in the recurrent form. But it has one big weakness:

**nothing ever gets forgotten.**

Every outer product $k_i^T v_i$ keeps sitting inside $S_t$ forever unless later writes happen to cancel it out. That is not ideal if the model should stop caring about old context.

So GLA adds forgetting.

---

## 2. GLA Adds a Gate, but in a Very Specific Way

GLA introduces a data-dependent 2D gate:

$$
S_t = G_t \odot S_{t-1} + k_t^T v_t
$$

where $G_t \in (0,1)^{d_k \times d_v}$ and $\odot$ is element-wise multiplication.

If you stopped here and made $G_t$ fully dense, the model would be expressive, but training it efficiently would become much harder. So the paper uses a structured gate:

$$
G_t = \alpha_t^T \mathbf{1}, \qquad \alpha_t \in (0,1)^{1 \times d_k}
$$

That means every row of $S_{t-1}$ gets its own scalar decay, but that scalar is shared across all columns in that row. So the recurrence becomes:

$$
S_t = \operatorname{Diag}(\alpha_t)\, S_{t-1} + k_t^T v_t \tag{1}
$$

This is the paper's compromise point:

- a **fully dense** gate would be more general, but much harder to train efficiently
- a **single scalar** gate would be easier to train, but less expressive
- a **vector gate over rows** is the middle ground

In other words, the gate is not shaped this way by accident. It is shaped this way so the model remains expressive **and** still admits the chunkwise hardware story later in the paper.

### 2.1 What this means intuitively

Think of $S_t$ as a matrix notebook.

- $k_t^T v_t$ writes new information into that notebook.
- $\operatorname{Diag}(\alpha_t)$ fades old rows before the new write happens.
- If $\alpha_t[i] \approx 1$, row $i$ is mostly kept.
- If $\alpha_t[i] \approx 0$, row $i$ is mostly erased.

So GLA is still linear attention, but now it gets to say, row by row, "this old stuff still matters" or "nah, we can let this fade."

### 2.2 How the gate is produced

The paper uses a low-rank projection:

$$
\alpha_t = \sigma(x_t W_\alpha^1 W_\alpha^2 + b_\alpha)^{1/\tau}
$$

with:

- $W_\alpha^1 \in \mathbb{R}^{d \times 16}$
- $W_\alpha^2 \in \mathbb{R}^{16 \times d_k}$
- $b_\alpha \in \mathbb{R}^{1 \times d_k}$
- $\tau = 16$

The exponent $1/\tau$ nudges the gate toward values close to 1, so the model forgets slowly by default instead of immediately nuking its memory. Which is good. A model that forgets everything instantly is less "long-context architecture" and more "goldfish with matrix multiplications."

### 2.3 Notation sanity check before we continue

The paper uses:

- $b_\alpha$ for the **bias** in the gate projection
- $\mathbf{b}_t$ later for the **cumulative product of gates**

Those are completely different objects. This is legal notation. It is also mildly annoying.

So in **this article**:

- I keep $b_\alpha$ for the bias term
- I rename the cumulative gate product to **$c_t$**

Same math. Less notation whiplash lol.

---

## 3. Why the Training Problem Is Not Already Solved

Equation (1) is a perfectly fine recurrent model. But a naive implementation runs token by token:

$$
S_1 \to S_2 \to S_3 \to \cdots \to S_L
$$

That is bad news for GPUs, because GPUs like large parallel matrix multiplies, not long chains of tiny dependent updates.

So the paper first asks:

**Can we keep the recurrence idea, but reorganize the computation so training becomes chunk-parallel and hardware-friendly?**

Before doing that for GLA, the paper first explains the systems picture for ordinary chunkwise linear attention. That picture is worth understanding, because GLA builds directly on top of it.

---

## 4. The Chunkwise Systems Picture

![Custom chunkwise training diagram based on the paper](/images/blog/sliding-window-attention-explained-the-core-concept-and-the-math-without-any-fluff/chunkwise-idea-explained.svg)

*Custom explanatory diagram based on the paper. It separates the story into the three pieces that matter most: streaming one chunk at a time, scanning and storing chunk states, and then using those stored states to compute chunk outputs in parallel.*

This figure is doing a lot of work, so let us decode it slowly.

### 4.1 Panel (a): sequential without materialization

The top-left panel is the most memory-efficient version.

- You carry the chunk hidden state forward.
- You compute the output for the current chunk.
- You do **not** store every chunk state in HBM.

This saves memory, but it is still sequential across chunks.

### 4.2 Panel (b): sequential scan of chunk states

The bottom-left panel computes the chunk states

$$
S_{[0]}, S_{[1]}, S_{[2]}, \dots
$$

one after another and stores them.

That storage step costs memory, but it creates a useful object: the hidden state available at the start of each chunk.

### 4.3 Panel (c): parallel chunk outputs once states are known

Once those chunk states are materialized, the outputs of different chunks can be computed in parallel.

That is the key tradeoff:

- more memory,
- much better parallelism over sequence length.

This is the same high-level idea the paper will use for GLA. First do a chunk-level scan. Then use the resulting chunk states to parallelize the per-chunk output computation.

So the next question becomes:

**How do we get a chunkwise form for the gated recurrence without breaking numerical stability?**

---

## 5. From the Recurrent GLA Equation to a Parallel Form

Start again from:

$$
S_t = \operatorname{Diag}(\alpha_t)\, S_{t-1} + k_t^T v_t
$$

If we unroll it, each old write gets multiplied by all the gates that came after it.

Define the cumulative gate product:

$$
c_t = \prod_{j=1}^{t} \alpha_j \in (0,1)^{1 \times d_k}
$$

Then the output can be rewritten as:

$$
o_t
= \sum_{i=1}^{t} (q_t \odot c_t)\left(\frac{k_i}{c_i}\right)^T v_i \tag{2}
$$

where division is element-wise.

If we stack all $c_t$ row-wise into a matrix $C \in (0,1)^{L \times d_k}$, the whole sequence can be written in a parallel attention-style form:

$$
O = \left[\left((Q \odot C)\left(\frac{K}{C}\right)^T\right)\odot M\right]V \tag{3}
$$

This is the crucial algebraic move in the paper.

It says:

- the recurrence can be rewritten in a parallel form,
- the gating effect gets absorbed into rescaled queries and keys,
- so in principle we can parallelize over sequence positions.

That sounds like victory.

It is not victory yet.

---

## 6. Why the Naive Parallel Form Blows Up

Look closely at $c_t$:

$$
c_t = \prod_{j=1}^{t} \alpha_j
$$

Each $\alpha_j$ lives in $(0,1)$, so repeated multiplication makes $c_t$ shrink toward zero as $t$ grows.

That means the term

$$
\frac{K}{C}
$$

can explode.

So the direct form in equation (3) is numerically unstable.

The paper fixes this by computing the attention-like matrix in log space:

$$
P_{ij} = \sum_{r=1}^{d_k} Q_{ir} K_{jr}\, \exp(\log C_{ir} - \log C_{jr}), \qquad i \ge j \tag{4}
$$

This is numerically safer, but it introduces a new problem:

**equation (4) is no longer a standard matrix multiplication.**

And that matters because tensor cores are happiest when you give them dense half-precision matmuls. They are much less excited about custom log-space inner loops with exponentials inside the summation.

So the paper has now traded one problem for another:

- recurrence was too sequential,
- naive parallelization was unstable,
- stable parallelization is no longer tensor-core-friendly.

This is where chunking comes back.

---

## 7. Chunkwise GLA: Split the Sequence, Keep the Math Stable

Suppose the sequence is divided into chunks of length $C$.

Let:

- $S_{[i]}$ be the hidden state after chunk $i$
- $Q_{[i]}, K_{[i]}, V_{[i]}$ be the queries, keys, and values of chunk $i$

For a position $iC + j$ inside chunk $i+1$, the paper defines three decay factors:

$$
\Lambda_{iC+j} = \frac{c_{iC+j}}{c_{iC}}, \qquad
\Gamma_{iC+j} = \frac{c_{(i+1)C}}{c_{iC+j}}, \qquad
\gamma_{i+1} = \frac{c_{(i+1)C}}{c_{iC}}
$$

These look abstract at first, so here is the plain-English version:

- $\Lambda$: decay from the **start of the chunk** to the current position
- $\Gamma$: decay from the **current position** to the **end of the chunk**
- $\gamma$: decay across the **entire chunk**

This is the right place to slow down, because these three objects are the bridge between the recurrent view and the chunkwise view.

### 7.1 Chunk-level hidden-state update

The inter-chunk recurrence becomes:

$$
S_{[i+1]}
= (\gamma_{i+1}^T \mathbf{1}) \odot S_{[i]}
+ (K_{[i+1]} \odot \Gamma_{[i+1]})^T V_{[i+1]} \tag{5}
$$

Interpretation:

- old state $S_{[i]}$ is decayed across the whole chunk via $\gamma_{i+1}$
- new writes inside the chunk are weighted by how much they survive to the chunk end via $\Gamma_{[i+1]}$

### 7.2 Chunk output = inter + intra

The chunk output splits into two pieces:

$$
O_{[i+1]}^{\text{inter}} = (Q_{[i+1]} \odot \Lambda_{[i+1]}) S_{[i]} \tag{6}
$$

$$
O_{[i+1]}^{\text{intra}}
= \left[\left(Q_{[i+1]} \odot \Lambda_{[i+1]}\right)
\left(\frac{K_{[i+1]}}{\Lambda_{[i+1]}}\right)^T
\odot M\right] V_{[i+1]} \tag{7}
$$

and then

$$
O_{[i+1]} = O_{[i+1]}^{\text{inter}} + O_{[i+1]}^{\text{intra}} \tag{8}
$$

The idea is:

- **inter** handles information that came from earlier chunks
- **intra** handles interactions inside the current chunk

This is the same decomposition pattern we saw in the earlier systems diagram. The gated case is harder only because the decay factors now vary with the data, so we must carry around these $\Lambda$, $\Gamma$, and $\gamma$ terms.

---

## 8. The Real Hardware Trick: Secondary-Level Chunking

Even after chunking, the intra-chunk part still contains the nasty log-space computation. So the paper introduces a **second level of chunking** inside each chunk.

This figure is the key picture:

![Secondary chunking map from the paper](/images/blog/sliding-window-attention-explained-the-core-concept-and-the-math-without-any-fluff/secondary-chunking-from-paper.png)

*Figure from the paper source. Gray, orange, and pink tiles correspond to different parts of the chunkwise computation and different hardware behavior.*

Here is how to read it.

### 8.1 Gray blocks: inter-chunk dependencies

The gray region corresponds to interactions between different large chunks.

Those are handled indirectly through the chunk hidden states $S_{[i]}$. We do **not** compute a full dense attention matrix over those regions inside the chunkwise kernel.

### 8.2 Orange blocks: inter-sub-chunk work

Inside a chunk, split again into smaller sub-chunks.

For interactions between **different** sub-chunks, the relative decay factor is constant with respect to positions inside those two sub-chunks. That means the paper can rewrite those orange regions as ordinary matmuls:

$$
P_{[i][j]}
= \left(Q_{[i]} \odot \Lambda_{[i]}\right)
\left(K_{[j]} \odot \Gamma_{[j]} \odot \frac{c_{iC}}{c_{(j+1)C}}\right)^T \tag{9}
$$

That constant factor is the whole trick.

Because it is constant across the two sub-chunks, the interaction collapses back into a standard matrix multiply. Which means tensor cores are back in business.

### 8.3 Pink diagonal blocks: the annoying part that stays

Inside a **single** sub-chunk, that nice simplification is no longer available. Those pink blocks still need the full log-space computation for numerical stability.

So the algorithm does something very practical:

- let the bulk of the work use fast half-precision matmuls,
- keep only the small diagonal trouble spots in full precision.

This is one of those ideas that feels obvious only after somebody else has already done the painful algebra.

---

## 9. Why the Backward Pass Looks Scary at First

Suppose you want gradients with respect to the gate.

A naive derivation gives something like:

$$
d\alpha_t = (S_{t-1} \odot dS_t)\mathbf{1}
$$

That seems to require $S_{t-1}$ for **every** timestep $t$.

If you materialize all hidden states, memory cost becomes:

$$
O(L \cdot d_k \cdot d_v)
$$

which is exactly the kind of thing that makes long-sequence training annoying.

So the paper looks for a way to compute gate gradients **without** storing the full chain of matrix states.

---

## 10. The Closed-Form Gradient Trick

Instead of differentiating through every explicit hidden state, the paper works with the cumulative gate product in log space.

Using our notation $c_t$ (the paper writes this as $b_t$), the key result is:

$$
d\log c_t = q_t \odot dq_t - k_t \odot dk_t \tag{10}
$$

and because

$$
\log c_t = \sum_{j=1}^{t} \log \alpha_j
$$

we get

$$
d\log \alpha_t = \sum_{i=t}^{L} d\log c_i \tag{11}
$$

Equation (11) is just a **reverse cumulative sum**.

That is much cheaper than storing every hidden state matrix.

So the backward pass strategy becomes:

1. compute $dq_t$ and $dk_t$ from the chunkwise backward pass,
2. form $d\log c_t$ using equation (10),
3. do a reverse cumulative sum to get $d\log \alpha_t$.

This reduces the gate-gradient computation to $O(Ld_k)$ additional work without materializing all $S_t$.

That is a big deal. Without this step, the model might still be elegant on paper, but much less pleasant in practice.

---

## 11. What the Full GLA Transformer Layer Looks Like

For multiple heads, each head runs its own recurrence:

$$
S_t^h = \left((\alpha_t^h)^T \mathbf{1}\right)\odot S_{t-1}^h + (k_t^h)^T v_t^h,
\qquad
o_t^h = q_t^h S_t^h
$$

Then the head outputs are layer-normalized, concatenated, and passed through an output gate:

$$
o_t' = \operatorname{concat}(\operatorname{LN}(o_t^1), \ldots, \operatorname{LN}(o_t^H))
$$

$$
r_t = \operatorname{Swish}(x_t W_r + b_r), \qquad
y_t = (r_t \odot o_t') W_O
$$

At the block level, GLA is used like a transformer attention layer:

$$
Y^{(l)} = \operatorname{GLA}(\operatorname{LN}(X^{(l)})) + X^{(l)}
$$

$$
X^{(l+1)} = \operatorname{SwiGLU}(\operatorname{LN}(Y^{(l)})) + Y^{(l)}
$$

So architecturally, the model is still very transformer-like.

The big difference is not "we deleted all transformer structure."

The big difference is:

- replace softmax attention with a matrix-state recurrent mechanism,
- add a structured, data-dependent forget gate,
- train it with a chunkwise algorithm that respects GPU hardware.

---

## 12. What the Paper Is Really Accomplishing

It is tempting to summarize the paper as:

> "They added a gate to linear attention."

That is true, but it undersells the engineering part.

The full story is closer to this:

1. Start with linear attention as an RNN with matrix-valued state.
2. Add a data-dependent forget gate so the model can actually forget.
3. Notice the naive recurrent form is too sequential.
4. Derive a parallel form.
5. Notice that the naive parallel form is numerically unstable.
6. Move into log space.
7. Notice that log-space computation breaks tensor-core-friendly matmuls.
8. Introduce chunkwise and then secondary-level chunking so most of the work becomes standard matmul again.
9. Derive a gradient formula that avoids storing every matrix state.

That is why this paper is interesting.

It is not just proposing a nicer recurrence. It is threading a very specific needle:

- richer than fixed-decay linear attention,
- more trainable than a fully general gated matrix-state RNN,
- structured enough to map efficiently onto modern GPUs.

---

## 13. Final Mental Model

If you want one compact way to remember GLA, use this:

- **Linear attention** gives you a matrix memory $S_t$.
- **GLA** lets each row of that memory fade at an input-dependent rate.
- **The cumulative gate products** are what connect the recurrent view to the parallel view.
- **Chunkwise training** separates old-context contribution from within-chunk contribution.
- **Secondary chunking** pushes most of the expensive work back onto tensor cores.
- **The log-gradient trick** removes the need to store every hidden state.

So the paper's central idea is not merely "add a forget gate."

It is:

**add a forget gate, but keep the structure just constrained enough that the model still admits a stable, chunkwise, hardware-efficient training algorithm.**

And honestly, that "just constrained enough" part is where most of the paper's real cleverness lives.
