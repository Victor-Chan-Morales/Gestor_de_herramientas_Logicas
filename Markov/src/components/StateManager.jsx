import React, { useState } from 'react'

export default function StateManager({ states, setStates, loadExample }) {
  const [raw, setRaw] = useState(states.join(','))

  function apply() {
    const arr = raw.split(',').map(s => s.trim()).filter(Boolean)
    if (arr.length === 0) return alert('Ingresa al menos un estado.')
    setStates(arr)
  }

  return (
    <div className="card mb-4">
      <h3 className="text-lg font-semibold mb-2">1. Definir Estados</h3>
      <input
        value={raw}
        onChange={e => setRaw(e.target.value)}
        className="w-full border rounded p-2 mb-2"
        placeholder="Ej: W,L,T,D,V"
      />
      <div className="flex gap-2">
        <button onClick={apply} className="bg-indigo-600 text-white px-4 py-2 rounded">Aplicar</button>
        <button onClick={() => { setRaw('Almacén, Carga, En tránsito, Retrasado, Entregado'); loadExample() }} className="bg-gray-100 px-4 py-2 rounded">Cargar ejemplo</button>
      </div>
    </div>
  )
}
