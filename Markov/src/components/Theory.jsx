import React, { useEffect } from 'react'

export default function Theory({ states }) {
  useEffect(() => {
    // Si MathJax ya cargó, pedir re-render
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise()
    }
  }, [states])

  // HTML con fórmulas LaTeX (MathJax las renderizará)
  const html = `
    <h3 class="text-lg font-semibold mb-2">Sustentación Teórica</h3>
    <p>Definimos el autómata probabilístico como:</p>
    <p>\\( A = (Q, \\Sigma, \\delta, P, q_0, F) \\)</p>
    <ul>
      <li>\\(Q\\): Conjunto de estados. Por ejemplo: \\(${states.join(', ')}\\)</li>
      <li>\\(\\Sigma\\): Alfabeto de transiciones (anotaciones de movimiento entre estados).</li>
      <li>\\(\\delta\\): Relación de transición (grafo dirigido que indica adyacencia).</li>
      <li>\\(P\\): Matriz de transición donde cada fila suma \\(1\\). \\(P_{ij}=\\mathbb{P}(X_{t+1}=j\\mid X_t=i)\\).</li>
      <li>\\(q_0\\): Estado inicial (o distribución inicial \\(\\pi(0)\\)).</li>
      <li>\\(F\\): Estados de observación (por ejemplo el estado 'Delivered').</li>
    </ul>
    <p>Comportamiento tras \\(n\\) pasos:</p>
    <p>\\( P^{n} \\) representa la matriz de n-pasos. Si \\(\\pi(0)\\) es la distribución inicial (fila), entonces:</p>
    <p>\\( \\pi(n) = \\pi(0) \\cdot P^{n} \\)</p>
    <p>Esto permite estimar la probabilidad de encontrarse en cualquier estado tras \\(n\\) transiciones.</p>
  `

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
