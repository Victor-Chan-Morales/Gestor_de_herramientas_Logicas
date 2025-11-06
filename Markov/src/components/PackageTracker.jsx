import React, { useState } from 'react'
import { BoxIcon, TruckIcon, AlertTriangleIcon, ChecklistIcon } from './icons'

const STATE_ICONS = {
  'Almacén': BoxIcon,
  'Carga': TruckIcon,
  'En tránsito': TruckIcon,
  'Retrasado': AlertTriangleIcon,
  'Entregado': ChecklistIcon
}

function formatElapsedTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}min`
  } else if (minutes > 0) {
    return `${minutes}min ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

function PackageCard({ pkg, states }) {
  const [expanded, setExpanded] = useState(false)
  const elapsed = Date.now() - pkg.startTime
  const CurrentStateIcon = STATE_ICONS[pkg.currentState] || BoxIcon
  
  // Estimar probabilidad de entrega en 24h (simplificado)
  const deliveryProbability = pkg.isDelivered ? 100 : 
    pkg.currentStateIdx === states.length - 2 ? 85 : // Retrasado
    pkg.currentStateIdx === states.length - 3 ? 75 : // En tránsito
    pkg.currentStateIdx === states.length - 4 ? 60 : // Carga
    45 // Almacén

  const statusColor = pkg.isDelivered ? '#10b981' : 
    pkg.currentState === 'Retrasado' ? '#ef4444' :
    pkg.currentState === 'En tránsito' ? '#f59e0b' :
    '#3b82f6'

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.6)',
      border: `1px solid ${statusColor}40`,
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '0.75rem',
      transition: 'all 0.2s ease'
    }}>
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CurrentStateIcon size={28} color={statusColor} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--fg)', fontSize: '0.95rem' }}>
              {pkg.id}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
              {pkg.currentState}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: `${statusColor}20`,
            color: statusColor,
            padding: '0.25rem 0.75rem',
            borderRadius: '16px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {pkg.isDelivered ? (
              <>
                <ChecklistIcon size={14} color={statusColor} />
                Entregado
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={statusColor} strokeWidth="2">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
                En proceso
              </>
            )}
          </div>
          <span style={{ color: 'var(--muted)', fontSize: '1rem' }}>
            {expanded ? '▼' : '▶'}
          </span>
        </div>
      </div>

      {/* Detalles expandidos */}
      {expanded && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          {/* Timeline */}
          <div style={{ marginBottom: '1rem' }}>
            <h5 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: 'var(--accent)',
              marginBottom: '0.75rem' 
            }}>
              Historial de Estados
            </h5>
            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              {pkg.history.map((entry, idx) => {
                const isLast = idx === pkg.history.length - 1
                const IconComponent = STATE_ICONS[entry.state] || BoxIcon
                const time = new Date(entry.timestamp).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })

                return (
                  <div 
                    key={idx}
                    style={{ 
                      marginBottom: idx === pkg.history.length - 1 ? 0 : '1rem',
                      position: 'relative'
                    }}
                  >
                    {/* Línea vertical */}
                    {!isLast && (
                      <div style={{
                        position: 'absolute',
                        left: '-1.25rem',
                        top: '1.5rem',
                        width: '2px',
                        height: 'calc(100% + 0.5rem)',
                        background: isLast ? 'var(--accent)' : 'var(--border)'
                      }} />
                    )}
                    
                    {/* Círculo */}
                    <div style={{
                      position: 'absolute',
                      left: '-1.5rem',
                      top: '0.25rem',
                      width: '0.75rem',
                      height: '0.75rem',
                      borderRadius: '50%',
                      background: isLast ? 'var(--accent)' : 'var(--border)',
                      border: '2px solid var(--bg)',
                      zIndex: 1
                    }} />

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: '0.9rem', 
                          fontWeight: isLast ? 700 : 600,
                          color: isLast ? 'var(--accent)' : 'var(--fg)',
                          marginBottom: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <IconComponent size={16} color={isLast ? 'var(--accent)' : 'var(--fg-muted)'} />
                          {entry.state}
                        </div>
                        {isLast && (
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--muted)',
                            marginTop: '0.25rem'
                          }}>
                            Estado actual
                          </div>
                        )}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--muted)',
                        textAlign: 'right'
                      }}>
                        {time}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Estadísticas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            marginTop: '1rem'
          }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '0.75rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                Tiempo transcurrido
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--fg)' }}>
                {formatElapsedTime(elapsed)}
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '0.75rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                Estados visitados
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--fg)' }}>
                {pkg.history.length}
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '0.75rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                Prob. entrega 24h
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>
                {deliveryProbability}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PackageTracker({ packages, states }) {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  if (!packages || packages.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">
          📦 Tracking de Paquetes
        </h3>
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          color: 'var(--muted)'
        }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <BoxIcon size={80} color="var(--muted)" />
          </div>
          <p>Inicia la simulación para ver el tracking de paquetes individuales</p>
        </div>
      </div>
    )
  }

  // Filtrar paquetes
  let filteredPackages = packages

  if (filter !== 'all') {
    filteredPackages = packages.filter(pkg => {
      if (filter === 'delivered') return pkg.isDelivered
      if (filter === 'active') return !pkg.isDelivered
      if (filter === 'delayed') return pkg.currentState === 'Retrasado'
      return true
    })
  }

  if (searchTerm) {
    filteredPackages = filteredPackages.filter(pkg => 
      pkg.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const filterOptions = [
    { key: 'all', label: 'Todos', Icon: BoxIcon },
    { key: 'active', label: 'Activos', Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
      </svg>
    ) },
    { key: 'delivered', label: 'Entregados', Icon: ChecklistIcon },
    { key: 'delayed', label: 'Retrasados', Icon: AlertTriangleIcon }
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BoxIcon size={24} color="var(--accent)" />
        Tracking de Paquetes
      </h3>

      {/* Controles de filtrado */}
      <div className="mb-4" style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Buscar por ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: '1 1 200px', minWidth: '200px' }}
        />
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {filterOptions.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={filter === key ? 'bg-indigo-600' : 'bg-gray-200'}
              style={{
                fontSize: '0.85rem',
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de paquetes */}
      <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {filteredPackages.length > 0 ? (
          filteredPackages.slice(0, 20).map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} states={states} />
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--muted)'
          }}>
            No se encontraron paquetes con los filtros aplicados
          </div>
        )}
        
        {filteredPackages.length > 20 && (
          <div style={{
            textAlign: 'center',
            padding: '1rem',
            color: 'var(--muted)',
            fontSize: '0.85rem'
          }}>
            Mostrando 20 de {filteredPackages.length} paquetes
          </div>
        )}
      </div>
    </div>
  )
}

