# Gated Linear Attention: The Core Idea

**Based on:** "Gated Linear Attention Transformers with Hardware-Efficient Training" by Yang et al. (ICML 2024) [[arXiv:2312.06635](https://arxiv.org/abs/2312.06635)]

This article covers what GLA actually is as a sequence model -- the recurrence, the gate, and why the design choices are what they are. The math is worked through step by step, and every variable is defined as it appears.

A companion article covers the hardware-efficient training side: how to actually run this recurrence at scale on GPUs without it either blowing up numerically or exhausting memory.

---

## 1. Standard Linear Attention: The Foundation

### 1.1 Softmax Attention

Let $x \in \mathbb{R}^{L \times d}$ be a sequence of $L$ tokens, each of dimension $d$. A transformer layer projects this into:

$$Q = xW_Q, \quad K = xW_K, \quad V = xW_V$$

where $W_Q, W_K \in \mathbb{R}^{d \times d_k}$ and $W_V \in \mathbb{R}^{d \times d_v}$ are learned projection matrices. For a general non-negative similarity function $\text{sim}(q, k)$, the output at position $t$ under causal masking is:

$$o_t = \frac{\displaystyle\sum_{i=1}^{t} \text{sim}(q_t,\, k_i)\, v_i}{\displaystyle\sum_{i=1}^{t} \text{sim}(q_t,\, k_i)} \tag{1}$$

where $q_t, k_i \in \mathbb{R}^{1 \times d_k}$ and $v_i \in \mathbb{R}^{1 \times d_v}$ are the $t$-th and $i$-th rows of $Q$, $K$, $V$ respectively.

For softmax attention, $\text{sim}(q, k) = \exp(q k^T / \sqrt{d_k})$. Computing equation (1) for all $t$ requires materializing an $L \times L$ attention matrix -- $O(L^2)$ in time and memory.

### 1.2 The Kernel Trick: Factorize sim

Instead of computing similarity directly, express it as an inner product of feature representations:

$$\text{sim}(q, k) = \phi(q)\, \phi(k)^T \tag{2}$$

where $\phi : \mathbb{R}^{d_k} \to \mathbb{R}^{d_\phi}$ is a feature map that produces non-negative outputs. Substituting into equation (1):

$$o_t = \frac{\phi(q_t) \left[\displaystyle\sum_{i=1}^{t} \phi(k_i)^T v_i\right]}{\phi(q_t) \left[\displaystyle\sum_{i=1}^{t} \phi(k_i)^T\right]} \tag{3}$$

The key observation: the bracketed quantities are **the same for every query $t$** -- they are cumulative sums over past tokens. Define:

$$S_t = \sum_{i=1}^{t} \phi(k_i)^T v_i \in \mathbb{R}^{d_\phi \times d_v}, \qquad z_t = \sum_{i=1}^{t} \phi(k_i)^T \in \mathbb{R}^{d_\phi} \tag{4}$$

Then equation (3) collapses to:

$$o_t = \frac{\phi(q_t)\, S_t}{\phi(q_t)\, z_t} \tag{5}$$

Both $S_t$ and $z_t$ update in $O(1)$ per step:

$$S_t = S_{t-1} + \phi(k_t)^T v_t, \qquad z_t = z_{t-1} + \phi(k_t)^T \tag{6}$$

This is a literal RNN with a matrix-valued hidden state $S_t$. Total cost: $O(L \cdot d_\phi \cdot d_v)$ -- **linear in sequence length**.

### 1.3 With the Identity Feature Map

In practice, the identity map $\phi = I$ (i.e. $\phi(x) = x$, so $d_\phi = d_k$) works well and simplifies the recurrence in equation (6) to:

$$S_t = S_{t-1} + k_t^T v_t, \qquad o_t = q_t S_t \tag{7}$$

**Variable reference:**
- $S_t \in \mathbb{R}^{d_k \times d_v}$ -- **matrix-valued hidden state**
- $k_t, q_t \in \mathbb{R}^{1 \times d_k}$ -- key and query row vectors at timestep $t$
- $v_t \in \mathbb{R}^{1 \times d_v}$ -- value row vector at timestep $t$
- $k_t^T v_t \in \mathbb{R}^{d_k \times d_v}$ -- outer product that writes new information into the state

The normalizer $z_t$ is often dropped in practice (the paper notes this is stable with $\phi = I$).

The problem: **no forgetting mechanism**. Every past token's outer product $k_i^T v_i$ accumulates in $S_t$ with equal weight, regardless of how far back it occurred. The model cannot selectively suppress outdated information.

---

## 2. The GLA Recurrence

GLA introduces a **data-dependent 2D forget gate** $G_t \in (0,1)^{d_k \times d_v}$:

$$S_t = G_t \odot S_{t-1} + k_t^T v_t$$

where $\odot$ is element-wise (Hadamard) product, $d_k$ is the key dimension, and $d_v$ is the value dimension.

### The parameterization of $G_t$

A full $d_k \times d_v$ gate matrix per timestep would be parameter-heavy. GLA uses a **rank-1 structure**:

$$G_t = \alpha_t^T \mathbf{1}, \qquad \alpha_t \in (0,1)^{1 \times d_k}$$

where $\mathbf{1} \in \mathbb{R}^{1 \times d_v}$ is a vector of ones. This means row $i$ of $S_t$ gets uniformly scaled by $\alpha_t[i]$, making $G_t$ act as $\text{Diag}(\alpha_t)$ on the left. The recurrence becomes:

$$S_t = \text{Diag}(\alpha_t)\, S_{t-1} + k_t^T v_t$$

$\alpha_t$ is computed from the input $x_t \in \mathbb{R}^{1 \times d}$ via a **low-rank linear layer followed by sigmoid**:

$$\alpha_t = \sigma\!\left(x_t W_\alpha^1 W_\alpha^2 + b_\alpha\right)^{1/\tau}$$

**Variable reference:**
- $W_\alpha^1 \in \mathbb{R}^{d \times 16}$, $W_\alpha^2 \in \mathbb{R}^{16 \times d_k}$ -- low-rank projection (bottleneck dimension 16)
- $b_\alpha \in \mathbb{R}^{1 \times d_k}$ -- bias
- $\sigma$ -- sigmoid, ensuring $\alpha_t \in (0,1)^{d_k}$
- $\tau = 16$ -- temperature that pushes $\alpha_t$ close to 1, encouraging **slow forgetting** by default

By default the paper sets $d_k = d/2$ and $d_v = d$.

### Why rank-1?

The gate $G_t = \alpha_t^T \mathbf{1}$ applies independent scalar decay to each row of $S_t$, but the same scalar across all columns of that row. This is a deliberate structural constraint: it keeps the gate expressive enough to be useful (each key dimension can forget at its own input-dependent rate) while making the computation separable in a way that later enables efficient GPU training. A fully general $d_k \times d_v$ gate per step would not have this property.

### What $\alpha_t$ close to 1 means

When $\alpha_t[i] \approx 1$, row $i$ of $S_{t-1}$ passes through almost unchanged. The model retains past information. When $\alpha_t[i] \approx 0$, that row is nearly wiped and the new outer product $k_t^T v_t$ dominates. The temperature $\tau = 16$ biases the gate toward retention by default, and the model learns to deviate from this when the input signals that forgetting is warranted.

### A small notation note

The paper uses $b_\alpha$ for the bias in the gate projection, and later also uses $\mathbf{b}_t$ for the cumulative gate product. Those are different objects. To keep this short article cleaner, I will call the cumulative gate product $c_t$ instead.

---

## Summary

The full GLA recurrence is:

$$S_t = \text{Diag}(\alpha_t)\, S_{t-1} + k_t^T v_t, \qquad o_t = q_t S_t$$

where $\alpha_t \in (0,1)^{d_k}$ is computed from the current input token. That's the model. Everything else in the paper is about making it trainable at scale.

| Component | Role |
|---|---|
| $S_t \in \mathbb{R}^{d_k \times d_v}$ | Matrix memory state |
| $k_t^T v_t \in \mathbb{R}^{d_k \times d_v}$ | New information written to state |
| $\text{Diag}(\alpha_t)$ | Per-row, input-dependent forgetting |
| $\alpha_t = \sigma(x_t W_\alpha^1 W_\alpha^2)^{1/\tau}$ | Gate: low-rank, data-dependent |
| $o_t = q_t S_t$ | Read from state |

---

## What's left

The recurrence above is defined and interpretable, but training it naively is slow and runs into real problems. Running it as a sequential loop is too slow for long sequences. Converting it to a parallel form introduces numerical instability -- the cumulative gate product $c_t = \prod_{j=1}^t \alpha_j$ decays exponentially to zero, which makes the equivalent parallel computation unstable in half precision. The backward pass has its own issue: computing gradients with respect to $\alpha_t$ naively requires storing all $L$ hidden states simultaneously, which is $O(L \cdot d_k \cdot d_v)$ in GPU memory.

The longer companion article, **"Gated Linear Attention: From the Core Idea to Hardware-Efficient Training,"** covers how Yang et al. solve all three: a chunkwise parallel form that avoids the instability, a two-level tiling scheme that pushes most of the compute onto tensor cores, and a gradient reformulation that brings the backward pass down to $O(Ld_k)$ without materializing any hidden states.
