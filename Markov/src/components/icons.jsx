import React from 'react'

export const BoxIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    className={className}
  >
    <path 
      fill="none" 
      stroke={color} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="m12 3l8 4.5v9L12 21l-8-4.5v-9L12 3m0 9l8-4.5M12 12v9m0-9L4 7.5"
    />
  </svg>
)

export const ChecklistIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    className={className}
  >
    <path 
      fill="none" 
      stroke={color} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M9.615 20H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8m-3 5l2 2l4-4M9 8h4m-4 4h2"
    />
  </svg>
)

export const ClockIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/>
      <path d="M12 7v5l3 3"/>
    </g>
  </svg>
)

export const AlertTriangleIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    className={className}
  >
    <path 
      fill="none" 
      stroke={color} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="m10.24 3.957l-8.422 14.06A1.989 1.989 0 0 0 3.518 21h16.845a1.989 1.989 0 0 0 1.7-2.983L13.64 3.957a1.989 1.989 0 0 0-3.4 0zM12 9v4m0 4h.01"
    />
  </svg>
)

export const TruckIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0m10 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/>
      <path d="M5 17H3v-4M2 5h11v12m-4 0h6m4 0h2v-6h-8m0-5h5l3 5M3 9h4"/>
    </g>
  </svg>
)

export const MapIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </g>
  </svg>
)

export const PlayIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    className={className}
  >
    <polygon 
      fill="none" 
      stroke={color} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2"
      points="5 3 19 12 5 21 5 3"
    />
  </svg>
)

export const ChartIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </g>
  </svg>
)

export const ZapIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    className={className}
  >
    <polygon 
      fill="none" 
      stroke={color} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2"
      points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
    />
  </svg>
)

export const TreeIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M12 19v-7m0 0L8 8h8l-4 4z"/>
      <path d="m12 5l-4 3h8l-4-3z"/>
      <path d="M12 19h4v2H8v-2h4z"/>
    </g>
  </svg>
)

