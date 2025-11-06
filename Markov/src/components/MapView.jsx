import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { BoxIcon, TruckIcon, AlertTriangleIcon, ChecklistIcon } from './icons'

// Fix para los iconos de Leaflet en producción
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const LOCATIONS = {
  'Almacén': { coords: [14.6349, -90.5069], color: '#3b82f6', Icon: BoxIcon },
  'Carga': { coords: [14.6407, -90.5131], color: '#8b5cf6', Icon: TruckIcon },
  'En tránsito': { coords: [14.7833, -91.5167], color: '#f59e0b', Icon: TruckIcon },
  'Retrasado': { coords: [14.5833, -90.5167], color: '#ef4444', Icon: AlertTriangleIcon },
  'Entregado': { coords: [14.8333, -91.5167], color: '#10b981', Icon: ChecklistIcon }
}

export default function MapView({ states, P, packages = {} }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})
  const linesRef = useRef([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Inicializar mapa centrado en Guatemala
    const map = L.map(mapRef.current).setView([14.6349, -90.5069], 9)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    // Agregar marcadores para cada estado
    states.forEach(state => {
      const location = LOCATIONS[state]
      if (!location) return

      const marker = L.circleMarker(location.coords, {
        radius: 20,
        fillColor: location.color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      }).addTo(map)

      // Popup con información
      const popupDiv = document.createElement('div')
      popupDiv.style.cssText = 'text-align: center; min-width: 150px;'
      popupDiv.innerHTML = `
        <div id="icon-${state}" style="margin-bottom: 0.5rem; display: flex; justify-content: center;"></div>
        <strong style="color: ${location.color}; font-size: 1.1rem;">${state}</strong>
        <div style="margin-top: 0.5rem; font-size: 0.9rem;">
          Paquetes: <strong id="count-${state}">0</strong>
        </div>
      `
      
      marker.bindPopup(popupDiv)
      
      // Renderizar el icono React en el popup cuando se abra
      marker.on('popupopen', () => {
        const iconContainer = document.getElementById(`icon-${state}`)
        if (iconContainer && !iconContainer.hasChildNodes()) {
          const IconComponent = location.Icon
          const root = createRoot(iconContainer)
          root.render(<IconComponent size={32} color={location.color} />)
        }
      })

      markersRef.current[state] = marker
    })

    // Dibujar líneas de transición basadas en matriz P
    drawTransitions(map, states, P)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [states])

  useEffect(() => {
    // Actualizar líneas cuando cambia P
    if (mapInstanceRef.current) {
      // Limpiar líneas anteriores
      linesRef.current.forEach(line => line.remove())
      linesRef.current = []
      
      drawTransitions(mapInstanceRef.current, states, P)
    }
  }, [P, states])

  useEffect(() => {
    // Actualizar contadores de paquetes
    states.forEach(state => {
      const count = packages[state] || 0
      const element = document.getElementById(`count-${state}`)
      if (element) {
        element.textContent = count
      }
    })
  }, [packages, states])

  function drawTransitions(map, states, P) {
    states.forEach((fromState, i) => {
      states.forEach((toState, j) => {
        if (i === j || P[i][j] === 0) return
        
        const fromLoc = LOCATIONS[fromState]
        const toLoc = LOCATIONS[toState]
        if (!fromLoc || !toLoc) return

        const probability = P[i][j]
        const weight = Math.max(2, probability * 10)
        const opacity = Math.max(0.3, probability)

        // Línea con estilo según probabilidad
        const line = L.polyline([fromLoc.coords, toLoc.coords], {
          color: fromLoc.color,
          weight: weight,
          opacity: opacity,
          dashArray: fromState === toState ? '10, 10' : null
        }).addTo(map)

        linesRef.current.push(line)

        // Tooltip con probabilidad y flecha visual
        line.bindTooltip(
          `<div style="text-align: center;">
            <strong>${fromState}</strong> → <strong>${toState}</strong><br>
            <span style="font-size: 1.2rem; color: ${fromLoc.color};">${(probability * 100).toFixed(1)}%</span>
          </div>`,
          { permanent: false, direction: 'center', className: 'custom-tooltip' }
        )
      })
    })
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">
        🗺️ Mapa de Flujo de Paquetes
      </h3>
      <p className="text-sm text-gray-400 mb-3">
        Visualización geográfica del sistema de distribución con rutas y probabilidades
      </p>
      
      <div 
        ref={mapRef} 
        style={{ 
          height: '500px', 
          borderRadius: '12px',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}
      />

      <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2">
        {states.map(state => {
          const location = LOCATIONS[state]
          if (!location) return null
          
          const IconComponent = location.Icon
          
          return (
            <div 
              key={state}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '8px',
                fontSize: '0.85rem'
              }}
            >
              <div 
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: location.color,
                  flexShrink: 0
                }}
              />
              <IconComponent size={20} color={location.color} />
              <span style={{ color: 'var(--fg)', fontSize: '0.8rem' }}>{state}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

