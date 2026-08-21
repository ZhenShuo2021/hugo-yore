---
title: Nesting Shortcode Test
draft: true
slug: nest-test
weight: 2070
date: 2026-01-17T10:40:00+08:00
series: ["Shortcodes"]
params:
  mathEnabled: true
---

This page tests whether the nested shortcodes function correctly.

## Steps

{{% steps %}}

  {{< step label=":sparkles:" >}}

{{< masonry columns="3" >}}

- src: /img/02.webp
  alt: Fly high
  caption: Hello world!
- src: /img/03.webp
  alt: Contrails
- src: /img/04.webp
  alt: Parapet
- src: /img/05.webp
  alt: Wing
- src: /img/06.webp
  alt: Eaves
- src: /img/07.webp
  alt: Biplane sunset
- src: /img/drop.svg
  alt: SVG sample

{{< /masonry >}}

  {{< /step >}}

  {{< step label="2" >}}

{{< carousel ratio="32/9" fit="cover" arrows=false >}}

- match: /img/?[5-7]* # 05, 06, 07
- src: /img/drop.svg
  caption: carousel caption
  alt: carousel alt

{{< /carousel >}}

  {{< /step >}}

  {{< step icon="check-circle" circleClass="text-success" >}}

{{< chart >}}
option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
};
{{< /chart >}}

  Your site is up and running[^fn-steps].

  [^fn-steps]: Footnotes are supported!

  {{< /step >}}

{{% /steps %}}

## Tabs

<!-- 1 -->

{{% tabs group="outer" %}}
  {{< tab label="article" >}}

  {{< lead >}}
  {{< article path="/docs/80-getting-started/index.md" >}}

  foo[^foo]

  [^foo]: foo

  {{< /lead >}}

  {{< /tab >}}

  {{< tab label="figure" >}}

  {{% fig
    src="img/07.webp"
    alt="Nature scene"
    caption="Caption **markdown** test[^fig]" %}}

  [^fig]: Footnote inside fig inside tabs.

  {{< /tab >}}

  {{< tab label="github" >}}

  {{< github repo="gohugoio/hugo" >}}

  {{< /tab >}}
{{% /tabs %}}

<!-- 2 -->

{{% tabs group="outer2" %}}
  {{< tab label="video" >}}

  {{< video
    src="https://upload.wikimedia.org/wikipedia/commons/5/5a/CC0_-_Public_Domain_Dedication_video_bumper.webm"
    muted=true
    loop=true
  >}}

  {{< /tab >}}

  {{< tab label="youtube" >}}

  {{< youtube id="ldX1Ii0MofQ" params="start=30" >}}

  {{< /tab >}}

  {{< tab label="typeit" >}}

  {{< typeit speed="50" loop="true" tag="h3" >}}
  Nested TypeIt Test
  {{< /typeit >}}

  {{< /tab >}}
{{% /tabs %}}

<!-- 3 -->

{{% tabs group="math-diagram" default="Math" %}}
  {{< tab label="Math" >}}

$$
f(a,b,c) = (a^2+b^2+c^2)^3
$$

  {{< /tab >}}

  {{< tab label="Mermaid" >}}

  ```mermaid
  graph LR;
  A-->B;
  B-->C;
  ```

  {{< /tab >}}
{{% /tabs %}}

## Cols

<!-- 1 -->

article, masonry

{{% cols %}}

{{< article path="/docs/80-getting-started" >}}

<!-- cell -->

{{< masonry columns="2" >}}

- src: /img/04.webp
  alt: Parapet
  caption: "cap!!!"
- src: /img/05.webp
  alt: Wing
  caption: "!@#$%^&*()_+`~"

{{< /masonry >}}

{{% /cols %}}

<!-- 2 -->

chart

{{% cols %}}

{{< chart >}}
option = {
  xAxis:{type:'category',data:['A','B','C']},
  yAxis:{type:'value'},
  series:[{data:[1,2,3],type:'line'}]
};
{{< /chart >}}

<!-- cell -->

{{< chart >}}
option = {
  xAxis:{type:'category',data:['A','B','C']},
  yAxis:{type:'value'},
  series:[{data:[1,2,3],type:'line'}]
};
{{< /chart >}}

{{% /cols %}}

## MathJax Extension Tests

### boldsymbol

Inline: $\boldsymbol{\alpha} + \boldsymbol{\beta} = \boldsymbol{\gamma}$, and $\boldsymbol{\nabla} \times \boldsymbol{E} = -\frac{\partial \boldsymbol{B}}{\partial t}$.

$$
\boldsymbol{\sigma} = \begin{pmatrix} \sigma_{xx} & \sigma_{xy} & \sigma_{xz} \\ \sigma_{yx} & \sigma_{yy} & \sigma_{yz} \\ \sigma_{zx} & \sigma_{zy} & \sigma_{zz} \end{pmatrix}
\qquad
\boldsymbol{\epsilon}_k = \frac{\hbar^2 k^2}{2m} \hat{\boldsymbol{k}}
$$

### braket

State vectors and expectation values:

$\ket{\psi}$, $\bra{\phi}$, $\braket{\phi}{\psi}$, $\braket{\psi}{\hat{H}}{\psi}$

$$
\braket{\hat{A}} = \braket{\psi}{\hat{A}}{\psi}
\qquad
\braket{x}{p} = \frac{1}{\sqrt{2\pi\hbar}} e^{ipx/\hbar}
\qquad
\sum_n \ket{n}\bra{n} = \mathbf{1}
$$

### cancel

Inline: $\frac{\cancel{m} g}{\cancel{m}} = g$, $\frac{3\bcancel{x^2}}{6\bcancel{x^2}} = \frac{1}{2}$, $\xcancel{(a-b)} + (b-a) = 0$.

$$
\cancelto{0}{\frac{\partial \rho}{\partial t}} + \nabla \cdot \mathbf{J} = 0
\qquad
E = \cancel{mc^2} + \frac{p^2}{2m} - \bcancel{\frac{p^4}{8m^3c^2}} + \cdots
$$

### color

$$
\textcolor{red}{E} = \textcolor{blue}{m} \textcolor{green}{c}^2
\qquad
\colorbox{yellow}{$\displaystyle \int_a^b f(x)\,dx = F(b) - F(a)$}
$$

$$
\begin{aligned}
\textcolor{orange}{\mathbf{A}} \mathbf{x} &= \textcolor{purple}{\mathbf{b}} \\
\mathbf{x} &= \textcolor{orange}{\mathbf{A}}^{-1} \textcolor{purple}{\mathbf{b}}
\end{aligned}
$$

### physics

Derivatives: $\dv{f}{x}$, $\dv[2]{f}{x}$, $\pdv{f}{x}$, $\pdv[2]{f}{x,y}$, $\fdv{F}{\phi}$

Brackets: $\qty(\frac{1}{2})$, $\qty[\frac{a}{b}]$, $\qty{\frac{x}{y}}$, $\qty|\frac{p}{q}|$, $\qty\big(\frac{A}{B})$

Vectors: $\vb{F} = m\vb{a}$, $\vb*{\omega} \times \vb*{r}$, $\grad \phi$, $\div \vb{A}$, $\curl \vb{B}$

{{< math >}}
$$
\laplacian \phi = \frac{1}{r^2}\pdv{}{r}\qty(r^2 \pdv{\phi}{r})
+ \frac{1}{r^2 \sin\theta}\pdv{}{\theta}\qty(\sin\theta \pdv{\phi}{\theta})
+ \frac{1}{r^2 \sin^2\theta} \pdv[2]{\phi}{\varphi}
$$
{{< /math >}}

Dirac notation with physics: $\mel{\psi}{\hat{H}}{\phi} = \int \psi^*(x) \hat{H} \phi(x)\, \dd{x}$

Commutator: $\comm{\hat{x}}{\hat{p}} = i\hbar$, $\acomm{\gamma^\mu}{\gamma^\nu} = 2g^{\mu\nu}$

### chemistry

Simple reactions: $\ce{H2O}$, $\ce{CO2}$, $\ce{Na+}$, $\ce{SO4^2-}$

Reaction arrows: $\ce{A -> B}$, $\ce{A <-> B}$, $\ce{A <=> B}$, $\ce{A ->[$k_1$][$k_{-1}$] B}$

$$
\ce{6CO2 + 6H2O ->[\text{light}][\text{chlorophyll}] C6H12O6 + 6O2}
$$

$$
\ce{Fe^2+ + 2e- -> Fe}
\qquad
\ce{Zn + H2SO4 -> ZnSO4 + H2 ^}
$$

{{< math >}}
$$
\ce{
  R-C(=[O:1])(-[2]OH) + R'OH <=>[\text{acid}][\Delta]
  R-C(=[O:1])(-[2]OR') + H2O
}
$$
{{< /math >}}

### unicode

Symbols: $\unicode{x2665}$ (♥), $\unicode{x2660}$ (♠), $\unicode{x2663}$ (♣), $\unicode{x2666}$ (♦)

Greek via unicode: $\unicode{x03B1}$ (α), $\unicode{x03B2}$ (β), $\unicode{x03C0}$ (π), $\unicode{x03A3}$ (Σ)

Math symbols: $\unicode{x2200}$ (∀), $\unicode{x2203}$ (∃), $\unicode{x221E}$ (∞), $\unicode{x2207}$ (∇)

### upgreek

Upright Greek in text context: $\upalpha$, $\upbeta$, $\upgamma$, $\updelta$, $\upepsilon$

$$
\upsigma_{\upmu} = \sqrt{\frac{1}{N}\sum_{i=1}^{N}(x_i - \upmu)^2}
\qquad
\uptheta = \upomega t + \upphi_0
$$

Distinguishing italic vs upright: $\alpha\upalpha$, $\beta\upbeta$, $\pi\uppi$, $\sigma\upsigma$

### newcommand / renewcommand / def

{{< math >}}
$$
\newcommand{\RR}{\mathbb{R}}
\newcommand{\CC}{\mathbb{C}}
\newcommand{\ZZ}{\mathbb{Z}}
\newcommand{\NN}{\mathbb{N}}
\newcommand{\norm}[1]{\left\lVert #1 \right\rVert}
\newcommand{\abs}[1]{\left\lvert #1 \right\rvert}
\newcommand{\inner}[2]{\left\langle #1,\, #2 \right\rangle}
f : \RR^n \to \CC
\qquad
\norm{\mathbf{x}} = \sqrt{\inner{\mathbf{x}}{\mathbf{x}}}
\qquad
\abs{z} = \sqrt{\operatorname{Re}(z)^2 + \operatorname{Im}(z)^2}
$$

$$
\forall \mathbf{u}, \mathbf{v} \in \RR^n : \abs{\inner{\mathbf{u}}{\mathbf{v}}} \leq \norm{\mathbf{u}} \norm{\mathbf{v}}
$$
{{< /math >}}

### amscd (commutative diagrams)

**Short exact sequence:**
$$
\begin{CD}
0 @>>> A @>f>> B @>g>> C @>>> 0
\end{CD}
$$

**2×2 square:**
$$
\begin{CD}
A @>f>> B \\
@VgVV @VVhV \\
C @>>k> D
\end{CD}
$$

**Pullback diagram:**
{{< math >}}
$$
\begin{CD}
P @>p_1>> X \\
@Vp_2VV @VVfV \\
Y @>>g> Z
\end{CD}
$$
{{< /math >}}

### matrix (various environments)

**pmatrix, bmatrix, vmatrix, Bmatrix:**

$$
\mathbf{A} = \begin{pmatrix} a & b \\ c & d \end{pmatrix}
\qquad
\det(\mathbf{A}) = \begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc
\qquad
\begin{Bmatrix} x \\ y \end{Bmatrix}
$$

**Block matrix with partial derivatives (Hessian):**

{{< math >}}
$$
\mathbf{H} =
\begin{bmatrix}
\frac{\partial^2 \Omega}{\partial \phi_1^2} & \frac{\partial^2 \Omega}{\partial \phi_1 \partial \phi_2} & \cdots & \frac{\partial^2 \Omega}{\partial \phi_1 \partial \phi_n} \\
\frac{\partial^2 \Omega}{\partial \phi_2 \partial \phi_1} & \frac{\partial^2 \Omega}{\partial \phi_2^2} & \cdots & \frac{\partial^2 \Omega}{\partial \phi_2 \partial \phi_n} \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial^2 \Omega}{\partial \phi_n \partial \phi_1} & \frac{\partial^2 \Omega}{\partial \phi_n \partial \phi_2} & \cdots & \frac{\partial^2 \Omega}{\partial \phi_n^2}
\end{bmatrix}
$$
{{< /math >}}

**cases environment:**

$$
|x| = \begin{cases} x & \text{if } x \geq 0 \\ -x & \text{if } x < 0 \end{cases}
\qquad
f(n) = \begin{cases} 1 & n = 0 \\ n \cdot f(n-1) & n > 0 \end{cases}
$$
