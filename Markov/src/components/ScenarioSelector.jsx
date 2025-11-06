import React from 'react'

const SCENARIOS = {
  normal: {
    name: "Operación Normal",
    icon: "📦",
    description: "Flujo estándar de paquetes con operación regular",
    P: [
      [0.1, 0.8, 0, 0, 0.1],
      [0.05, 0.1, 0.8, 0.05, 0],
      [0, 0, 0.85, 0.1, 0.05],
      [0, 0, 0.6, 0.35, 0.05],
      [0, 0, 0, 0, 1]
    ],
    metrics: { avgTime: '2.4 días', delayed: '5%', delivered: '94%' }
  },
  highSeason: {
    name: "Temporada Alta",
    icon: "🎄",
    description: "Navidad - Mayor congestión y tiempos de espera",
    P: [
      [0.15, 0.7, 0, 0.05, 0.1],
      [0.1, 0.15, 0.65, 0.1, 0],
      [0, 0, 0.75, 0.2, 0.05],
      [0, 0, 0.5, 0.45, 0.05],
      [0, 0, 0, 0, 1]
    ],
    metrics: { avgTime: '3.8 días', delayed: '18%', delivered: '78%' }
  },
  crisis: {
    name: "Crisis Logística",
    icon: "⚠️",
    description: "Problemas operativos severos",
    P: [
      [0.2, 0.6, 0, 0.1, 0.1],
      [0.15, 0.2, 0.5, 0.15, 0],
      [0, 0, 0.6, 0.35, 0.05],
      [0, 0, 0.4, 0.55, 0.05],
      [0, 0, 0, 0, 1]
    ],
    metrics: { avgTime: '5.2 días', delayed: '35%', delivered: '61%' }
  },
  optimal: {
    name: "Operación Óptima",
    icon: "⚡",
    description: "Máxima eficiencia operativa",
    P: [
      [0.05, 0.9, 0, 0, 0.05],
      [0, 0.05, 0.9, 0.05, 0],
      [0, 0, 0.9, 0.05, 0.05],
      [0, 0, 0.7, 0.25, 0.05],
      [0, 0, 0, 0, 1]
    ],
    metrics: { avgTime: '1.8 días', delayed: '2%', delivered: '98%' }
  }
}

export default function ScenarioSelector({ currentP, setP, states }) {
  const [selectedScenario, setSelectedScenario] = React.useState('normal')

  function loadScenario(key) {
    const scenario = SCENARIOS[key]
    setP(scenario.P)
    setSelectedScenario(key)
  }

  return (
    <div className="card mb-4">
      <h3 className="text-lg font-semibold mb-2">Escenarios de Simulación</h3>
      <p className="text-sm text-gray-400 mb-4">
        Selecciona un escenario predefinido para probar diferentes condiciones operativas
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {Object.entries(SCENARIOS).map(([key, scenario]) => (
          <button
            key={key}
            onClick={() => loadScenario(key)}
            className={`scenario-card ${selectedScenario === key ? 'selected' : ''}`}
            style={{
              background: selectedScenario === key 
                ? 'rgba(251, 191, 36, 0.15)' 
                : 'rgba(30, 41, 59, 0.6)',
              border: selectedScenario === key
                ? '2px solid rgba(251, 191, 36, 0.6)'
                : '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {scenario.icon}
            </div>
            <h4 style={{ 
              color: 'var(--accent)', 
              fontWeight: 700, 
              fontSize: '0.9rem',
              marginBottom: '0.25rem' 
            }}>
              {scenario.name}
            </h4>
            <p style={{ 
              color: 'var(--muted)', 
              fontSize: '0.75rem',
              marginBottom: '0.75rem',
              minHeight: '2.5rem'
            }}>
              {scenario.description}
            </p>
            <div style={{ 
              fontSize: '0.7rem', 
              color: 'var(--fg-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem'
            }}>
              <div>⏱️ {scenario.metrics.avgTime}</div>
              <div>⚠️ Retrasos: {scenario.metrics.delayed}</div>
              <div>✅ Entregados: {scenario.metrics.delivered}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="comparison-table" style={{
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: '8px',
        padding: '1rem',
        overflowX: 'auto'
      }}>
        <h4 style={{ 
          color: 'var(--accent)', 
          fontSize: '0.9rem', 
          fontWeight: 700,
          marginBottom: '0.75rem'
        }}>
          Comparación de Escenarios
        </h4>
        <table style={{ width: '100%', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Métrica</th>
              {Object.entries(SCENARIOS).map(([key, scenario]) => (
                <th key={key} style={{ textAlign: 'center', padding: '0.5rem' }}>
                  {scenario.icon} {scenario.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', fontWeight: 600 }}>Tiempo promedio</td>
              {Object.values(SCENARIOS).map((scenario, idx) => (
                <td key={idx} style={{ textAlign: 'center', padding: '0.5rem' }}>
                  {scenario.metrics.avgTime}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', fontWeight: 600 }}>% Retrasados</td>
              {Object.values(SCENARIOS).map((scenario, idx) => (
                <td key={idx} style={{ textAlign: 'center', padding: '0.5rem' }}>
                  {scenario.metrics.delayed}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', fontWeight: 600 }}>% Entregados</td>
              {Object.values(SCENARIOS).map((scenario, idx) => (
                <td key={idx} style={{ textAlign: 'center', padding: '0.5rem' }}>
                  {scenario.metrics.delivered}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

