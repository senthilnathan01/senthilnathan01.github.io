---
title: "Linear Attention Explained: The Core Concept and the Math, Without the Fluff"
slug: "linear-attention-explained"
category: tech
publishedAt: "2026-04-20T00:00:00.000Z"
summary: "This article cuts the fluff, gets straight to the core concept and math, and explains every variable as it appears. Nothing is left undefined."
---

# Linear Attention Explained: The Core Concept and the Math, Without the Fluff
*A self-contained walkthrough of the key idea from "Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention" (Katharopoulos et al., ICML 2020, arXiv:2006.16236)*

---

This article is based on a 2020 paper by Katharopoulos et al. which shows that by replacing the softmax in standard attention with a **kernel dot product**, you can reduce the complexity of self-attention from $O(N^2)$ to $O(N)$, and that this automatically makes the transformer equivalent to a recurrent neural network at inference time.

The paper is clean, but it mixes a lot of background and experimental detail with the core idea. This article cuts the fluff, gets straight to the core concept and math, and explains every variable as it appears. Nothing is left undefined.

---

## 1. What Standard Attention Does

Let $\mathbf{x} \in \mathbb{R}^{N \times F}$ be a sequence of $N$ feature vectors, each of dimension $F$. A transformer layer projects this input into three matrices:

$$
Q = xW_Q, \quad K = xW_K, \quad V = xW_V
$$

where $W_Q, W_K \in \mathbb{R}^{F \times D}$ and $W_V \in \mathbb{R}^{F \times M}$ are learned projection matrices. $D$ is the key/query dimension and $M$ is the value dimension.

For a general **non-negative** similarity function $\text{sim}(q, k)$, the attention output at position $i$ is:

$$
V'_i = \frac{\sum_{j=1}^{N} \text{sim}(Q_i, K_j)\, V_j}{\sum_{j=1}^{N} \text{sim}(Q_i, K_j)} \tag{1}
$$

$Q_i$ denotes the $i$-th row of $Q$ (a $D$-dimensional vector), same for $K_j$ and $V_j$. The output $V'_i \in \mathbb{R}^M$ is a weighted average of all value vectors.

For **softmax attention**, the similarity is:

$$
\text{sim}(q, k) = \exp\!\left(\frac{q^T k}{\sqrt{D}}\right)
$$

The full attention matrix $\text{softmax}(QK^T / \sqrt{D})$ has shape $N \times N$. Computing and storing it costs $O(N^2)$ in both time and memory. This is the bottleneck.

---

## 2. The Key Idea: Factorize sim with a Feature Map

Instead of computing similarity directly, express it as an inner product of explicit feature representations:

$$
\text{sim}(q, k) = \phi(q)^T \phi(k) \tag{2}
$$

where $\phi : \mathbb{R}^D \to \mathbb{R}^C$ is a **feature map** that produces non-negative outputs, and $C$ is the feature map output dimension.

Substituting into equation (1):

$$
V'_i = \frac{\phi(Q_i)^T \left[\sum_{j=1}^{N} \phi(K_j)\, V_j^T\right]}{\phi(Q_i)^T \left[\sum_{j=1}^{N} \phi(K_j)\right]} \tag{3}
$$

> **Why does this matter?** The two bracketed terms in equation (3) are the same for every query $i$:
> - $\sum_j \phi(K_j) V_j^T \in \mathbb{R}^{C \times M}$ — compute once
> - $\sum_j \phi(K_j) \in \mathbb{R}^C$ — compute once
>
> Then for each query, apply $\phi(Q_i)$ via a dot product. Total cost: $O(NCM)$ instead of $O(N^2 M)$.

---

## 3. Adding Causal Masking (For Autoregressive Use)

For autoregressive generation, position $i$ must only attend to positions $j \leq i$. Equation (1) becomes:

$$
V'_i = \frac{\phi(Q_i)^T \left[\sum_{j=1}^{i} \phi(K_j)\, V_j^T\right]}{\phi(Q_i)^T \left[\sum_{j=1}^{i} \phi(K_j)\right]} \tag{4}
$$

Define two **cumulative state** quantities:

$$
S_i = \sum_{j=1}^{i} \phi(K_j)\, V_j^T \in \mathbb{R}^{C \times M} \tag{5}
$$

$$
z_i = \sum_{j=1}^{i} \phi(K_j) \in \mathbb{R}^{C} \tag{6}
$$

Equation (4) then simplifies to:

$$
V'_i = \frac{\phi(Q_i)^T\, S_i}{\phi(Q_i)^T\, z_i} \tag{7}
$$

$S_i$ and $z_i$ update in $O(1)$ from the previous step:

$$
S_i = S_{i-1} + \phi(K_i)\, V_i^T
$$

$$
z_i = z_{i-1} + \phi(K_i)
$$

The full causal attention pass therefore costs $O(NCM)$ in time, **linear in** $N$.

---

## 4. This Is an RNN

The recurrence above is, by definition, a **recurrent neural network**. The full transformer layer (including the per-position feedforward sublayer $f_l$) can be written as:

$$
s_0 = 0, \quad z_0 = 0 \tag{8}
$$

$$
s_i = s_{i-1} + \phi(x_i W_K)\,(x_i W_V)^T \tag{9}
$$

$$
z_i = z_{i-1} + \phi(x_i W_K) \tag{10}
$$

$$
y_i = f_l\!\left(\frac{\phi(x_i W_Q)^T\, s_i}{\phi(x_i W_Q)^T\, z_i} + x_i\right) \tag{11}
$$

**Variable reference:**
- $x_i$: input at timestep $i$, shape $1 \times F$
- $W_K, W_V, W_Q$: learned projection matrices (same as before)
- $s_i$: attention memory state, shape $C \times M$
- $z_i$: normalizer memory state, shape $C$
- $f_l$: per-position feedforward sublayer (e.g. a two-layer MLP)
- $y_i$: output at timestep $i$
- $\phi$: feature map applied to the key and query projections

At **training time**, the cumulative sums can be parallelized (like a prefix scan), so GPU efficiency is preserved. At **inference time**, you maintain $s_i$ and $z_i$ as a fixed-size state and update one token at a time in $O(1)$ per step. No growing KV cache.

---

## 5. The Feature Map

For the kernel decomposition in equation (2) to work, $\phi$ must produce non-negative outputs. The paper uses:

$$
\phi(x) = \text{elu}(x) + 1 \tag{12}
$$

where $\text{elu}$ is the **exponential linear unit**:

$$
\text{elu}(x) = \begin{cases} x & \text{if } x \geq 0 \\ e^x - 1 & \text{if } x < 0 \end{cases}
$$

Adding 1 shifts the output range to always be positive. ELU is preferred over ReLU because ReLU sets gradients to zero for negative inputs, which can stall training.

This feature map **cannot exactly recover softmax attention** (the exact feature map for the exponential kernel is infinite-dimensional). But empirically, it converges to similar performance.

---

## 6. Complexity Summary

| Method | Time | Memory | Inference per step |
|---|---|---|---|
| Softmax attention | $O(N^2 \max(D,M))$ | $O(N^2)$ | $O(i^2)$ at step $i$ |
| Linear attention | $O(NCM)$ | $O(N \max(C,M))$ | **$O(1)$** |

$C$ = feature map dimension, $D$ = key/query dimension, $M$ = value dimension, $N$ = sequence length.

---

## Closing

The core insight here is not a new architecture so much as a **change of perspective**. Self-attention was always computing a weighted combination of values, and that weighting was always a similarity function. By choosing a similarity function that factors as a dot product of feature maps, matrix associativity does the rest, turning a quadratic computation into a linear one, and making the causal version a literal RNN.

The tradeoff is that you lose the ability to exactly replicate softmax attention, and the feature map choice matters for performance. But the paper shows this is a small price to pay for orders-of-magnitude faster inference.

Full paper: [arXiv:2006.16236](https://arxiv.org/abs/2006.16236) | Code: [linear-transformers.com](https://linear-transformers.com)
