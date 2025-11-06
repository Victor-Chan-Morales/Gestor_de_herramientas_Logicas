import React, { useState, useEffect } from 'react'
import { powerMatrix, multiplyPiByP } from '../utils/matrix'

export default function SimulationPanel({ states, P, setLastPn, setLastPin }) {
  const [n, setN] = useState(1)
  const [pi0raw, setPi0raw] = useState( () => {
    if (!states.length) return ''
    return states.map((s,i) => (i===0?1:0)).join(',')
  })
  const [Pn, setPn] = useState(null)
  const [pin, setPin] = useState(null)

  useEffect(() => {
    // Si cambian los estados, reajustar pi0 por defecto
    setPi0raw(states.map((s,i) => (i===0?1:0)).join(','))
  // eslint-disable-next-line
  }, [states])

  function run() {
    if (!P || P.length === 0) return alert('Debe definir y guardar la matriz P primero.')
    const nInt = parseInt(n)
    if (isNaN(nInt) || nInt < 0) return alert('n debe ser entero >= 0')
    const pi0 = pi0raw.split(',').map(x => Number(x))
    if (pi0.length !== states.length) return alert('π(0) debe tener la misma longitud que los estados.')
    const PnRes = powerMatrix(P, nInt) // matriz
    // Multiplica vector fila por matriz: pi0 (1xn) x Pn (nxn) -> 1xn
    const pinRes = multiplyPiByP(pi0, PnRes) // ahora multiplyPiByP devuelve array plano
    const pinNorm = pinRes.map(v => Number(v))

    setPn(PnRes)
    setPin(pinNorm)

    // Guardar los resultados en el App para poder exportar / mostrar separados
    if (typeof setLastPn === 'function') setLastPn(PnRes)
    if (typeof setLastPin === 'function') setLastPin(pinNorm)
  }

  return (
    <div className="card mb-4">
      <h3 className="text-lg font-semibold mb-2">3. Simulación</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <div>
          <label className="block text-sm">n (pasos)</label>
          <input type="number" value={n} onChange={e => setN(e.target.value)} className="border rounded p-2 w-full" min="0"/>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm">Distribución inicial π(0) (coma separada)</label>
          <input value={pi0raw} onChange={e => setPi0raw(e.target.value)} className="border rounded p-2 w-full" placeholder="Ej: 1,0,0,0,0" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={run} className="bg-indigo-600 text-white px-4 py-2 rounded">Calcular</button>
      </div>

      {Pn && (
        <div className="mt-4">
          <h4 className="font-medium">P^{n}</h4>
          <div className="overflow-auto">
            <table className="table-auto border-collapse">
              <tbody>
                {Pn.map((row,i) => (
                  <tr key={i}>
                    {row.map((v,j) => <td key={j} className="p-1 border">{Number(v).toFixed(6)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="mt-3 font-medium">π(n)</h4>
          <p>[ {pin.map(v => Number(v).toFixed(6)).join(', ')} ]</p>

          <h4 className="mt-3 font-medium">Distribución por estado</h4>
          <ul className="list-disc ml-6">
            {states.map((s,i) => (
              <li key={s}>{s} = {(pin[i]*100).toFixed(4)}%</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
