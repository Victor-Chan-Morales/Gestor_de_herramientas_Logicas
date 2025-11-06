import React, { useEffect, useRef } from 'react'
import { DataSet, Network } from 'vis-network/standalone'

export default function GraphView({ states, P }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const nodes = new DataSet(states.map((s,i) => ({ id: i, label: s, shape: 'circle' })))
    const edges = []
    for (let i = 0; i < states.length; i++) {
      for (let j = 0; j < states.length; j++) {
        const w = P?.[i]?.[j] ?? 0
        if (w > 0) {
          edges.push({ from: i, to: j, label: w.toFixed(3), arrows: 'to', font: { align: 'top' }})
        }
      }
    }
    const data = { nodes, edges }
    const opts = { edges: { smooth: false }, nodes: { size: 20 }, physics: { enabled: false } }
    const net = new Network(ref.current, data, opts)
    return () => net.destroy()
  }, [states, P])

  return (
    <div className="card mb-4">
      <h3 className="text-lg font-semibold mb-2">4. Visualización del Autómata</h3>
      <div ref={ref} style={{height: '420px'}} />
    </div>
  )
}
