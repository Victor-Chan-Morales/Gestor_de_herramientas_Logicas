import React, { useEffect, useState } from 'react'
import { validateRows } from '../utils/matrix'

export default function TransitionMatrix({ states, P, setP }) {
  const n = states.length
  const [localP, setLocalP] = useState(P.length ? P : Array.from({length:n}, () => Array(n).fill(0)))

  useEffect(() => {
    setLocalP(prev => {
      if (states.length === prev.length) return prev
      return Array.from({length: states.length}, (_, i) => Array.from({length: states.length}, (_, j) => prev[i]?.[j] ?? (i===j?1:0)))
    })
  // eslint-disable-next-line
  }, [states])

  function setCell(i,j,val) {
    const copy = localP.map(r => r.slice())
    copy[i][j] = Number(val)
    setLocalP(copy)
  }

  function save() {
    const res = validateRows(localP, 1e-3)
    if (!res.ok) {
      alert(`Fila ${res.row + 1} no suma 1 (suma=${res.sum.toFixed(4)}).`)
      return
    }
    setP(localP)
    alert('Matriz guardada correctamente.')
  }

  return (
    <div className="card mb-4">
      <h3 className="text-lg font-semibold mb-2">2. Matriz de Transición P</h3>
      <div className="overflow-auto">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              <th className="p-2"></th>
              {states.map((s, j) => <th key={j} className="p-2 text-left">{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {states.map((s,i) => (
              <tr key={i}>
                <th className="p-2">{s}</th>
                {states.map((_,j) => (
                  <td key={j} className="p-1">
                    <input
                      value={localP[i]?.[j] ?? 0}
                      onChange={e => setCell(i,j,e.target.value)}
                      type="number" step="0.001" min="0"
                      className="w-24 border rounded p-1"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <button onClick={save} className="bg-green-600 text-white px-4 py-2 rounded">Validar y Guardar</button>
      </div>
    </div>
  )
}
