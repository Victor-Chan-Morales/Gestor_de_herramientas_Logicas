import React, { useState, useEffect, useRef } from 'react'

function weightedRandom(probabilities) {
  const r = Math.random()
  let cumulative = 0
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i]
    if (r <= cumulative) return i
  }
  return probabilities.length - 1
}

export default function LiveSimulation({ states, P, onPackagesUpdate, onAllPackagesUpdate }) {
  const [packages, setPackages] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [numPackages, setNumPackages] = useState(50)
  const [stats, setStats] = useState({
    total: 0,
    byState: {}
  })
  const intervalRef = useRef(null)
  const packageIdCounter = useRef(0)

  function createPackage() {
    packageIdCounter.current += 1
    return {
      id: `PKG-${packageIdCounter.current.toString().padStart(3, '0')}`,
      currentStateIdx: 0, // Comienza en "Almacén"
      currentState: states[0],
      history: [{ state: states[0], timestamp: Date.now() }],
      startTime: Date.now(),
      isDelivered: false
    }
  }

  function initializePackages() {
    const newPackages = []
    for (let i = 0; i < numPackages; i++) {
      newPackages.push(createPackage())
    }
    setPackages(newPackages)
    setIsRunning(false)
  }

  function toggleSimulation() {
    setIsRunning(prev => !prev)
  }

  function resetSimulation() {
    setIsRunning(false)
    setPackages([])
    packageIdCounter.current = 0
    setStats({ total: 0, byState: {} })
  }

  useEffect(() => {
    if (!isRunning || packages.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setPackages(prevPackages => {
        return prevPackages.map(pkg => {
          // Si ya está entregado, no cambiar
          if (pkg.isDelivered) return pkg

          const currentIdx = pkg.currentStateIdx
          const probs = P[currentIdx]
          const nextIdx = weightedRandom(probs)
          const nextState = states[nextIdx]

          // Determinar si está entregado (último estado)
          const delivered = nextIdx === states.length - 1

          return {
            ...pkg,
            currentStateIdx: nextIdx,
            currentState: nextState,
            history: [...pkg.history, { state: nextState, timestamp: Date.now() }],
            isDelivered: delivered
          }
        })
      })
    }, 1000 / speed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, speed, P, states])

  // Actualizar estadísticas
  useEffect(() => {
    const byState = {}
    states.forEach(state => {
      byState[state] = packages.filter(pkg => pkg.currentState === state).length
    })

    setStats({
      total: packages.length,
      byState
    })

    // Notificar al componente padre
    if (onPackagesUpdate) {
      onPackagesUpdate(byState)
    }
    
    // Notificar todos los paquetes
    if (onAllPackagesUpdate) {
      onAllPackagesUpdate(packages)
    }
  }, [packages, states, onPackagesUpdate, onAllPackagesUpdate])

  const deliveredCount = packages.filter(p => p.isDelivered).length
  const deliveryRate = packages.length > 0 ? ((deliveredCount / packages.length) * 100).toFixed(1) : 0

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">🎮 Simulación en Tiempo Real</h3>
      
      {/* Controles */}
      <div className="mb-4 p-4" style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--muted)' }}>
              Cantidad de paquetes
            </label>
            <input
              type="number"
              value={numPackages}
              onChange={(e) => setNumPackages(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={isRunning || packages.length > 0}
              className="w-full"
              min="1"
              max="200"
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--muted)' }}>
              Velocidad: {speed}x
            </label>
            <input
              type="range"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              min="0.5"
              max="5"
              step="0.5"
              className="w-full"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            {packages.length === 0 ? (
              <button
                onClick={initializePackages}
                className="bg-indigo-600"
                style={{ flex: 1 }}
              >
                ▶️ Crear Paquetes
              </button>
            ) : (
              <>
                <button
                  onClick={toggleSimulation}
                  className="bg-indigo-600"
                  style={{ flex: 1 }}
                >
                  {isRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
                </button>
                <button
                  onClick={resetSimulation}
                  className="bg-gray-200"
                >
                  🔄
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas en tiempo real */}
      {packages.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="stat-card" style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                Total Paquetes
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3b82f6' }}>
                {stats.total}
              </div>
            </div>

            <div className="stat-card" style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                Entregados
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
                {deliveredCount}
              </div>
            </div>

            <div className="stat-card" style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                En Tránsito
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>
                {stats.byState['En tránsito'] || 0}
              </div>
            </div>

            <div className="stat-card" style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                Retrasados
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ef4444' }}>
                {stats.byState['Retrasado'] || 0}
              </div>
            </div>
          </div>

          {/* Distribución por estado */}
          <div className="mb-4" style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.75rem' }}>
              Distribución Actual
            </h4>
            {states.map(state => {
              const count = stats.byState[state] || 0
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              
              return (
                <div key={state} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.25rem',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: 'var(--fg)' }}>{state}</span>
                    <span style={{ color: 'var(--muted)', fontWeight: 600 }}>
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: 'rgba(71, 85, 105, 0.3)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: 'var(--accent)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tasa de entrega */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
              Tasa de Entrega Global
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>
              {deliveryRate}%
            </div>
          </div>
        </>
      )}
    </div>
  )
}

