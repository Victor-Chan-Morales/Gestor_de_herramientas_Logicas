import React, { useState } from 'react'
import StateManager from './components/StateManager'
import TransitionMatrix from './components/TransitionMatrix'
import SimulationPanel from './components/SimulationPanel'
import GraphView from './components/GraphView'
import ExportPanel from './components/ExportPanel'
import Theory from './components/Theory'
import ScenarioSelector from './components/ScenarioSelector'
import MapView from './components/MapView'
import LiveSimulation from './components/LiveSimulation'
import PackageTracker from './components/PackageTracker'
import MetricsDashboard from './components/MetricsDashboard'
import { MapIcon, ChartIcon } from './components/icons'

export default function App() {
  const [states, setStates] = useState(['Almacén','Carga','En tránsito','Retrasado','Entregado'])
  const [P, setP] = useState([
    [0.1,0.8,0,0,0.1],
    [0.05,0.1,0.8,0.05,0],
    [0,0,0.85,0.1,0.05],
    [0,0,0.6,0.35,0.05],
    [0,0,0,0,1]
  ])

  // Estado global para resultados (para exportar y mostrar por separado)
  const [lastPn, setLastPn] = useState(null)
  const [lastPin, setLastPin] = useState(null)

  // Estados para la simulación en vivo
  const [livePackages, setLivePackages] = useState([])
  const [packagesByState, setPackagesByState] = useState({})
  const [activeTab, setActiveTab] = useState('visual') // 'visual' o 'teorico'

  function loadExampleMatrix() {
    setP([
      [0.1,0.8,0,0,0.1],
      [0.05,0.1,0.8,0.05,0],
      [0,0,0.85,0.1,0.05],
      [0,0,0.6,0.35,0.05],
      [0,0,0,0,1]
    ])
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <a href="../../index.html" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(6, 182, 212, 0.15)',
          color: 'var(--accent)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          padding: '10px 18px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'all 0.2s ease'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          <span>Volver al menú</span>
        </a>
      </div>
      
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(6, 182, 212, 0.15)',
          color: 'var(--accent)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          padding: '6px 16px',
          borderRadius: '16px',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}>
          Sistema de Tracking de Paquetes
        </div>
        <h1 style={{
          fontSize: '2.75rem',
          fontWeight: 800,
          color: '#ffffff',
          marginBottom: '0.75rem',
          letterSpacing: '-1px',
          lineHeight: 1.1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <MapIcon size={44} color="var(--accent)" />
          Cadenas de Markov - Logística
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--muted)',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Sistema visual de tracking en tiempo real con simulación probabilística
        </p>
      </header>

      {/* Tabs de navegación */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('visual')}
          className={activeTab === 'visual' ? 'bg-indigo-600' : 'bg-gray-200'}
          style={{
            fontSize: '1rem',
            padding: '0.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <MapIcon size={20} />
          Modo Visual Interactivo
        </button>
        <button
          onClick={() => setActiveTab('teorico')}
          className={activeTab === 'teorico' ? 'bg-indigo-600' : 'bg-gray-200'}
          style={{
            fontSize: '1rem',
            padding: '0.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ChartIcon size={20} />
          Modo Teórico/Matemático
        </button>
      </div>

      {activeTab === 'visual' ? (
        <>
          {/* Selector de escenarios */}
          <ScenarioSelector currentP={P} setP={setP} states={states} />

          {/* Layout de 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <MapView states={states} P={P} packages={packagesByState} />
            <LiveSimulation 
              states={states} 
              P={P} 
              onPackagesUpdate={(byState) => {
                setPackagesByState(byState)
              }}
              onAllPackagesUpdate={(packages) => {
                setLivePackages(packages)
              }}
            />
          </div>

          {/* Dashboard de métricas */}
          <MetricsDashboard packages={livePackages} states={states} P={P} />

          {/* Tracking de paquetes */}
          <PackageTracker packages={livePackages} states={states} />

          {/* Grafo y teoría */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <GraphView states={states} P={P} />
            <div className="card">
              <Theory states={states} />
            </div>
          </div>
        </>
      ) : (
        <>
          <StateManager states={states} setStates={setStates} loadExample={loadExampleMatrix} />
          <TransitionMatrix states={states} P={P} setP={setP} />
          <SimulationPanel states={states} P={P} setLastPn={setLastPn} setLastPin={setLastPin} />
          <GraphView states={states} P={P} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <ExportPanel P={P} Pn={lastPn} pin={lastPin} states={states} />
            <div className="card col-span-2">
              <Theory states={states} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
