'use client'

import { useEffect, useState, type CSSProperties } from 'react'

const LINES = [
  { top: '20%', opacity: 0.3 }, { top: '35%', opacity: 0.5 }, { top: '50%', opacity: 0.3 },
  { top: '65%', opacity: 0.5 }, { top: '80%', opacity: 0.3 },
]

const ORBS: CSSProperties[] = [
  { left: '18%', top: '22%', width: '38%', opacity: 0.85 },
  { right: '15%', bottom: '20%', width: '28%', opacity: 0.7,
    background: 'radial-gradient(circle at 40% 35%, oklch(0.8 0.1 220) 0%, oklch(0.5 0.16 250) 50%, transparent 100%)' },
  { left: '52%', top: '52%', width: '20%', opacity: 0.6,
    background: 'radial-gradient(circle at 40% 35%, oklch(0.9 0.06 200) 0%, oklch(0.55 0.14 230) 60%, transparent 100%)' },
]

function makeParticles(): CSSProperties[] {
  return Array.from({ length: 28 }, () => {
    const size = 2 + Math.random() * 3
    return {
      left: `${15 + Math.random() * 70}%`,
      top: `${15 + Math.random() * 70}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${Math.random() * 3}s`,
    }
  })
}

function makeWavePath(): string {
  let d = 'M 0 15'
  for (let x = 1; x <= 200; x += 2) {
    const y = 15 + Math.sin(x * 0.15) * 6 * Math.sin(x * 0.04) + Math.sin(x * 0.5) * 2
    d += ` L ${x} ${y}`
  }
  return d
}

export function DriftArt() {
  const [particles, setParticles] = useState<CSSProperties[]>([])
  const [wavePath, setWavePath] = useState('M 0 15')
  useEffect(() => {
    setParticles(makeParticles())
    setWavePath(makeWavePath())
  }, [])

  return (
    <div>
      {LINES.map((line, i) => <div key={i} className="drift-line" style={line} />)}
      {ORBS.map((orb, i) => <div key={i} className="drift-orb" style={orb} />)}
      <div>
        {particles.map((p, i) => <div key={i} className="drift-particle" style={p} />)}
      </div>
      <svg className="drift-wave" viewBox="0 0 200 30" preserveAspectRatio="none">
        <path d={wavePath} stroke="oklch(0.78 0.14 230 / 0.7)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  )
}
