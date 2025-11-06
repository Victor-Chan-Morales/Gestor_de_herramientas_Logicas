import React, { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { ChartIcon, BoxIcon, ChecklistIcon, ClockIcon, ZapIcon } from './icons'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

function MetricCard({ icon, label, value, trend, color = 'var(--accent)' }) {
  const trendColor = trend && trend.startsWith('+') ? '#10b981' : 
                     trend && trend.startsWith('-') ? '#ef4444' : 
                     'var(--muted)'

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.6)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {icon}
        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{label}</span>
      </div>
      <div style={{ 
        fontSize: '2rem', 
        fontWeight: 800, 
        color: color,
        lineHeight: 1
      }}>
        {value}
      </div>
      {trend && (
        <div style={{ fontSize: '0.75rem', color: trendColor, fontWeight: 600 }}>
          {trend}
        </div>
      )}
    </div>
  )
}

function TransitionHeatmap({ P, states }) {
  const getColor = (value) => {
    return `rgba(6, 182, 212, ${value})`
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr>
            <th style={{ 
              padding: '0.5rem',
              textAlign: 'left',
              color: 'var(--accent)',
              fontWeight: 700
            }}>
              Desde / Hacia
            </th>
            {states.map(state => (
              <th key={state} style={{ 
                padding: '0.5rem',
                textAlign: 'center',
                color: 'var(--accent)',
                fontWeight: 700,
                fontSize: '0.75rem'
              }}>
                {state}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {states.map((fromState, i) => (
            <tr key={fromState}>
              <td style={{ 
                padding: '0.5rem',
                fontWeight: 700,
                color: 'var(--fg)'
              }}>
                {fromState}
              </td>
              {states.map((toState, j) => {
                const value = P[i][j]
                return (
                  <td
                    key={toState}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      background: getColor(value),
                      color: value > 0.5 ? '#000' : 'var(--fg)',
                      fontWeight: value > 0.5 ? 700 : 400,
                      border: '1px solid var(--border)'
                    }}
                  >
                    {(value * 100).toFixed(0)}%
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function MetricsDashboard({ packages, states, P }) {
  const [timeSeriesData, setTimeSeriesData] = React.useState([])
  const timeSeriesRef = useRef([])

  // Calcular métricas
  const calculateMetrics = () => {
    if (!packages || packages.length === 0) {
      return {
        total: 0,
        active: 0,
        delivered: 0,
        delayed: 0,
        deliveryRate: 0,
        avgTime: 0,
        efficiency: 0,
        byState: {}
      }
    }

    const total = packages.length
    const delivered = packages.filter(p => p.isDelivered).length
    const delayed = packages.filter(p => p.currentState === 'Retrasado').length
    const active = total - delivered

    const deliveredPackages = packages.filter(p => p.isDelivered)
    const avgTime = deliveredPackages.length > 0
      ? deliveredPackages.reduce((sum, p) => sum + (Date.now() - p.startTime), 0) / deliveredPackages.length
      : 0

    const deliveryRate = (delivered / total) * 100
    const efficiency = Math.max(0, 100 - (delayed / total * 100) - ((100 - deliveryRate) * 0.5))

    const byState = {}
    states.forEach(state => {
      byState[state] = packages.filter(p => p.currentState === state).length
    })

    return {
      total,
      active,
      delivered,
      delayed,
      deliveryRate,
      avgTime,
      efficiency,
      byState
    }
  }

  const metrics = calculateMetrics()

  // Actualizar serie temporal
  useEffect(() => {
    if (packages && packages.length > 0) {
      const now = Date.now()
      timeSeriesRef.current.push({
        timestamp: now,
        delivered: metrics.delivered,
        active: metrics.active,
        delayed: metrics.delayed
      })

      // Mantener solo últimos 30 puntos
      if (timeSeriesRef.current.length > 30) {
        timeSeriesRef.current.shift()
      }

      setTimeSeriesData([...timeSeriesRef.current])
    }
  }, [packages])

  // Datos para gráfico de barras (distribución por estado)
  const barChartData = {
    labels: states,
    datasets: [{
      label: 'Paquetes por estado',
      data: states.map(state => metrics.byState[state] || 0),
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(139, 92, 246, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(16, 185, 129, 0.7)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(16, 185, 129, 1)'
      ],
      borderWidth: 2
    }]
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: 'rgba(71, 85, 105, 0.2)'
        }
      },
      x: {
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          display: false
        }
      }
    }
  }

  // Datos para gráfico circular (proporciones)
  const doughnutData = {
    labels: ['Entregados', 'Activos', 'Retrasados'],
    datasets: [{
      data: [metrics.delivered, metrics.active - metrics.delayed, metrics.delayed],
      backgroundColor: [
        'rgba(16, 185, 129, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(239, 68, 68, 0.7)'
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2
    }]
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 15,
          font: {
            size: 12
          }
        }
      }
    }
  }

  // Datos para gráfico de línea (serie temporal)
  const lineChartData = {
    labels: timeSeriesData.map((_, idx) => `T${idx}`),
    datasets: [
      {
        label: 'Entregados',
        data: timeSeriesData.map(d => d.delivered),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Activos',
        data: timeSeriesData.map(d => d.active),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Retrasados',
        data: timeSeriesData.map(d => d.delayed),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          padding: 10,
          font: {
            size: 11
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: 'rgba(71, 85, 105, 0.2)'
        }
      },
      x: {
        ticks: {
          color: '#94a3b8',
          display: false
        },
        grid: {
          display: false
        }
      }
    }
  }

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 24) {
      return `${(hours / 24).toFixed(1)}d`
    } else if (hours > 0) {
      return `${hours}h`
    } else if (minutes > 0) {
      return `${minutes}min`
    } else {
      return `${seconds}s`
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ChartIcon size={24} color="var(--accent)" />
        Dashboard de Métricas
      </h3>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard
          icon={<BoxIcon size={24} color="#3b82f6" />}
          label="Total Paquetes"
          value={metrics.total}
          color="#3b82f6"
        />
        <MetricCard
          icon={<ChecklistIcon size={24} color="#10b981" />}
          label="Tasa de Entrega"
          value={`${metrics.deliveryRate.toFixed(1)}%`}
          color="#10b981"
        />
        <MetricCard
          icon={<ClockIcon size={24} color="#f59e0b" />}
          label="Tiempo Promedio"
          value={formatTime(metrics.avgTime)}
          color="#f59e0b"
        />
        <MetricCard
          icon={<ZapIcon size={24} color="#8b5cf6" />}
          label="Eficiencia"
          value={`${metrics.efficiency.toFixed(1)}%`}
          color="#8b5cf6"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Distribución por estado */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ 
            fontSize: '0.9rem', 
            fontWeight: 700, 
            color: 'var(--accent)',
            marginBottom: '1rem'
          }}>
            Distribución por Estado
          </h4>
          <div style={{ height: '250px' }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Proporciones */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ 
            fontSize: '0.9rem', 
            fontWeight: 700, 
            color: 'var(--accent)',
            marginBottom: '1rem'
          }}>
            Proporciones Generales
          </h4>
          <div style={{ height: '250px' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Serie temporal */}
      {timeSeriesData.length > 1 && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid var(--border)',
          marginBottom: '1rem'
        }}>
          <h4 style={{ 
            fontSize: '0.9rem', 
            fontWeight: 700, 
            color: 'var(--accent)',
            marginBottom: '1rem'
          }}>
            Evolución en Tiempo Real
          </h4>
          <div style={{ height: '200px' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      )}

      {/* Heatmap de transiciones */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: '12px',
        padding: '1rem',
        border: '1px solid var(--border)'
      }}>
        <h4 style={{ 
          fontSize: '0.9rem', 
          fontWeight: 700, 
          color: 'var(--accent)',
          marginBottom: '1rem'
        }}>
          Matriz de Probabilidades (Heatmap)
        </h4>
        <TransitionHeatmap P={P} states={states} />
      </div>
    </div>
  )
}

