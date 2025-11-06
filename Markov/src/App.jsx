import React, { useState } from 'react'
import StateManager from './components/StateManager'
import TransitionMatrix from './components/TransitionMatrix'
import SimulationPanel from './components/SimulationPanel'
import GraphView from './components/GraphView'
import ExportPanel from './components/ExportPanel'
import Theory from './components/Theory'

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
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <a href="../../index.html" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(251, 191, 36, 0.15)',
          color: 'var(--accent)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
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
          background: 'rgba(251, 191, 36, 0.15)',
          color: 'var(--accent)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          padding: '6px 16px',
          borderRadius: '16px',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}>
          Autómatas Probabilísticos
        </div>
        <h1 style={{
          fontSize: '2.75rem',
          fontWeight: 800,
          color: '#ffffff',
          marginBottom: '0.75rem',
          letterSpacing: '-1px',
          lineHeight: 1.1
        }}>
          Cadenas de Markov
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--muted)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Simula y analiza procesos estocásticos mediante matrices de transición probabilística
        </p>
      </header>
      <StateManager states={states} setStates={setStates} loadExample={loadExampleMatrix} />
      <TransitionMatrix states={states} P={P} setP={setP} />
      {/* Pasamos setters para que SimulationPanel actualice resultados globales */}
      <SimulationPanel states={states} P={P} setLastPn={setLastPn} setLastPin={setLastPin} />
      <GraphView states={states} P={P} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <ExportPanel P={P} Pn={lastPn} pin={lastPin} states={states} />
        <div className="card col-span-2">
          <Theory states={states} />
        </div>
      </div>
    </div>
  )
}
