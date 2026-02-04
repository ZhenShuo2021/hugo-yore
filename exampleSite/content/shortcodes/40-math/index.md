---
title: Math
slug: math
weight: 2040
date: 2026-01-17T10:40:00+08:00
tags: ["math", "mathjax", "latex", "rendering"]
description: "Learn how to enable and use MathJax for rendering complex mathematical equations and algorithms using LaTeX."
series: ["Shortcodes"]
params:
  mathEnabled: true
---

## MathJax

To enable MathJax support, configure the Goldmark renderer to bypass math notation by adding the following to your `hugo.yaml`:

```yaml
markup:
  goldmark:
    extensions:
      passthrough:
        enable: true
        delimiters:
          block:
            - ['\[', '\]']
            - ['$$', '$$']
          inline:
            - ['\(', '\)']
```

Then, activate math rendering for a specific page by setting `mathEnabled: true` in its front matter:

```markdown {title="index.md"}
---
title: "Example Page"
params:
  mathEnabled: true
---
```

**Example:**

```md
\(f(a,b,c) = (a^2+b^2+c^2)^3\)
```

\(f(a,b,c) = (a^2+b^2+c^2)^3\)

```txt
$$
\begin{align}
&h_{\text{LOS}} &&= e^{(j2\pi\mathcal{N}(1,1))} \\
&h_{\text{NLOS}} &&= \mathcal{CN}(0, \sigma^2) \\
&h &&= h_{\text{LOS}}\sqrt{\dfrac{K}{K + 1}} + h_{\text{NLOS}}\sqrt{\frac{1}{K + 1}}
\end{align}
$$
```

$$
\begin{align}
&h_{\text{LOS}} &&= e^{(j2\pi\mathcal{N}(1,1))} \\
&h_{\text{NLOS}} &&= \mathcal{CN}(0, \sigma^2) \\
&h &&= h_{\text{LOS}}\sqrt{\dfrac{K}{K + 1}} + h_{\text{NLOS}}\sqrt{\frac{1}{K + 1}}
\end{align}
$$

```txt
$$
\begin{array}{l}
\mathbf{\text{Algorithm 1: Block Orthogonal Matching Pursuit (BOMP)}} \\
\hline \\
\textbf{Input:} \text{ Measurement } \mathbf{y} \in \mathbb{C}^{M}, \text{ Dictionary } \mathbf{\Phi} = [\mathbf{\Phi}_1, \dots, \mathbf{\Phi}_L] \in \mathbb{C}^{M \times N}, \text{ Sparsity } K. \\
\textbf{Output:} \text{ Estimate } \hat{\mathbf{x}} \in \mathbb{C}^{N}. \\
\hline \\
\textbf{Initialization:} \\
\quad 1. \text{ Residual: } \mathbf{r}^0 \leftarrow \mathbf{y} \\
\quad 2. \text{ Block Support: } \mathbf{\Omega}^0 \leftarrow \emptyset \\
\quad 3. \text{ Iteration: } k \leftarrow 1 \\
\\
\mathbf{\text{while }} k \le K \mathbf{\text{ do}} \\
\quad 4. \quad \text{Block Selection:} \quad j_k \leftarrow \arg \max_{j \notin \mathbf{\Omega}^{k-1}} \left\| \mathbf{\Phi}_j^H \mathbf{r}^{k-1} \right\|_2 \\
\quad 5. \quad \text{Support Update:} \quad \mathbf{\Omega}^k \leftarrow \mathbf{\Omega}^{k-1} \cup \{j_k\} \\
\quad 6. \quad \text{Sub-dictionary:} \quad \mathbf{\Phi}_{\mathbf{\Omega}^k} \leftarrow [\mathbf{\Phi}_j \mid j \in \mathbf{\Omega}^k] \\
\quad 7. \quad \text{Coefficient Solve (LSE):} \quad \mathbf{c}^k \leftarrow \mathbf{\Phi}_{\mathbf{\Omega}^k}^{\dagger} \mathbf{y} \\
\quad 8. \quad \text{Residual Update:} \quad \mathbf{r}^k \leftarrow \mathbf{y} - \mathbf{\Phi}_{\mathbf{\Omega}^k} \mathbf{c}^k \\
\quad 9. \quad k \leftarrow k + 1 \\
\mathbf{\text{End while}} \\
\\
\textbf{Return:} \\
\quad 10. \text{ Reconstruct } \hat{\mathbf{x}} \text{ using coefficients } \mathbf{c}^K \text{ on support } \mathbf{\Omega}^K \text{ and zeros elsewhere.} \\
\hline
\end{array}
$$
```

$$
\begin{array}{l}
\mathbf{\text{Algorithm 1: Block Orthogonal Matching Pursuit (BOMP)}} \\
\hline \\
\textbf{Input:} \text{ Measurement } \mathbf{y} \in \mathbb{C}^{M}, \text{ Dictionary } \mathbf{\Phi} = [\mathbf{\Phi}_1, \dots, \mathbf{\Phi}_L] \in \mathbb{C}^{M \times N}, \text{ Sparsity } K. \\
\textbf{Output:} \text{ Estimate } \hat{\mathbf{x}} \in \mathbb{C}^{N}. \\
\hline \\
\textbf{Initialization:} \\
\quad 1. \text{ Residual: } \mathbf{r}^0 \leftarrow \mathbf{y} \\
\quad 2. \text{ Block Support: } \mathbf{\Omega}^0 \leftarrow \emptyset \\
\quad 3. \text{ Iteration: } k \leftarrow 1 \\
\\
\mathbf{\text{while }} k \le K \mathbf{\text{ do}} \\
\quad 4. \quad \text{Block Selection:} \quad j_k \leftarrow \arg \max_{j \notin \mathbf{\Omega}^{k-1}} \left\| \mathbf{\Phi}_j^H \mathbf{r}^{k-1} \right\|_2 \\
\quad 5. \quad \text{Support Update:} \quad \mathbf{\Omega}^k \leftarrow \mathbf{\Omega}^{k-1} \cup \{j_k\} \\
\quad 6. \quad \text{Sub-dictionary:} \quad \mathbf{\Phi}_{\mathbf{\Omega}^k} \leftarrow [\mathbf{\Phi}_j \mid j \in \mathbf{\Omega}^k] \\
\quad 7. \quad \text{Coefficient Solve (LSE):} \quad \mathbf{c}^k \leftarrow \mathbf{\Phi}_{\mathbf{\Omega}^k}^{\dagger} \mathbf{y} \\
\quad 8. \quad \text{Residual Update:} \quad \mathbf{r}^k \leftarrow \mathbf{y} - \mathbf{\Phi}_{\mathbf{\Omega}^k} \mathbf{c}^k \\
\quad 9. \quad k \leftarrow k + 1 \\
\mathbf{\text{End while}} \\
\\
\textbf{Return:} \\
\quad 10. \text{ Reconstruct } \hat{\mathbf{x}} \text{ using coefficients } \mathbf{c}^K \text{ on support } \mathbf{\Omega}^K \text{ and zeros elsewhere.} \\
\hline
\end{array}
$$
