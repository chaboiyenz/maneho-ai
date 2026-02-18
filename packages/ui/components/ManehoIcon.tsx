import React from 'react'
import { cn } from '../lib/utils'

interface ManehoIconProps extends React.SVGAttributes<SVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'filled' | 'outline'
  className?: string
}

export function ManehoIcon({
  size = 'md',
  variant = 'outline',
  className,
  ...props
}: ManehoIconProps) {
  const sizeMap = {
    sm: 32,
    md: 64,
    lg: 128,
    xl: 200,
  }

  const dimension = sizeMap[size]

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      width={dimension}
      height={dimension}
      className={cn('text-primary', className)}
      {...props}
    >
      {/* Main Background */}
      <rect width="200" height="200" fill="white" rx="40" />

      {/* Outer Guard Circle */}
      <circle
        cx="100"
        cy="100"
        r="92"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.2"
      />

      {/* Steering Wheel Frame */}
      <g id="steering-wheel-frame">
        {/* Main circular frame */}
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="7" />

        {/* Top grip segment */}
        <path
          d="M 95 31 A 70 70 0 0 1 105 31"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Four cardinal spokes */}
        <line x1="100" y1="30" x2="100" y2="55" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <line x1="100" y1="145" x2="100" y2="170" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <line x1="30" y1="100" x2="55" y2="100" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <line x1="145" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />

        {/* Diagonal spokes */}
        <line
          x1="45"
          y1="45"
          x2="62"
          y2="62"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />
        <line
          x1="155"
          y1="145"
          x2="138"
          y2="138"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />
        <line
          x1="155"
          y1="55"
          x2="138"
          y2="62"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />
        <line
          x1="45"
          y1="155"
          x2="62"
          y2="138"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Center hub */}
        <circle cx="100" cy="100" r="10" fill="currentColor" />
      </g>

      {/* Scales of Justice */}
      <g id="scales-justice">
        {/* Balance beam */}
        <line x1="60" y1="95" x2="140" y2="95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

        {/* Fulcrum point */}
        <polygon points="100,95 97,102 103,102" fill="currentColor" />

        {/* Left scale pan */}
        <rect x="55" y="100" width="20" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />

        {/* Right scale pan */}
        <rect x="125" y="100" width="20" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />

        {/* Left suspension lines */}
        <line x1="60" y1="95" x2="60" y2="100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="70" y1="95" x2="70" y2="100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right suspension lines */}
        <line x1="130" y1="95" x2="130" y2="100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="140" y1="95" x2="140" y2="100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* Gavel head */}
        <rect x="90" y="60" width="20" height="14" rx="1.5" fill="currentColor" />
        <rect x="98.5" y="74" width="3" height="12" fill="currentColor" strokeLinecap="round" />
        <circle cx="100" cy="88" r="2" fill="currentColor" />
      </g>

      {/* Compliance Indicator */}
      <g id="compliance-indicator" opacity="0.4">
        <circle cx="145" cy="145" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <polyline
          points="140,145 143,148 150,141"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export default ManehoIcon
