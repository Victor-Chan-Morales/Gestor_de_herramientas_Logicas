import React from 'react'

export default function ExportPanel({ P, Pn, pin, states }) {
  function exportCSV() {
    if (!Pn || !pin) return alert('No hay resultados para exportar. Ejecuta la simulación primero.')
    let csv = ''
    csv += 'P^n matrix\n'
    Pn.forEach(row => {
      csv += row.map(v => v).join(',') + '\n'
    })
    csv += '\npi(n)\n'
    csv += pin.join(',') + '\n\n'
    csv += 'Distribución por estado\n'
    csv += 'Estado,Probabilidad\n'
    states.forEach((s,i) => {
      csv += `${s},${(pin[i]*100).toFixed(6)}%\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'markov_results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">5. Exportar</h3>
      <div className="flex gap-2">
        <button onClick={exportCSV} className="bg-rose-500 text-white px-4 py-2 rounded">Exportar CSV</button>
      </div>
    </div>
  )
}
