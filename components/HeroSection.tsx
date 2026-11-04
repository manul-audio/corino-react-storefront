'use client'

import { useEffect, useState } from 'react'

const N = 64
const W = 360
const H = 80
const BAR_WIDTH = W / N - 1.5

const BASE = Array.from({ length: N }, (_, i) => {
  const t = i / N
  const decay = (1 - t) ** 0.7 * 0.85
  const wobble = Math.sin(i * 0.7) * 0.15 + Math.sin(i * 1.3) * 0.1
  return Math.max(0.05, decay + wobble)
})

function barsAt(phase: number) {
  return BASE.map((b, i) => {
    const animated = b * (0.7 + 0.3 * Math.abs(Math.sin((phase + i) * 0.4)))
    return { x: i * (W / N), width: BAR_WIDTH, y: H - animated * H, height: animated * H }
  })
}

export function HeroSection() {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setPhase((p) => p + 1), 120)
    return () => clearInterval(timer)
  }, [])
  const bars = barsAt(phase)

  return (
    <header id="top" className="hero">
      <div className="hero-meta">
        <span className="tag">CORINO STUDIO · EST. 2024</span>
        <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span className="flag" aria-label="Norway" role="img">🇳🇴</span>
          SOUND DESIGN · OSLO, NORWAY
        </span>
      </div>
      <h1>
        Sound,<br />
        <span className="italic">sculpted</span> with<br />
        <span className="accent">two plugins.</span>
      </h1>
      <div className="hero-sub">
        <p>
          We make two pieces of software — one to give your audio warmth,
          another to give it space. Built by a small team of mix engineers
          and DSP nerds. Designed to disappear into the music.
        </p>
      </div>
      <svg className="hero-spectrum" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {bars.map((b, i) => (
          <rect key={i} className="hero-spectrum-bar" x={b.x} y={b.y} width={b.width} height={b.height} />
        ))}
      </svg>
    </header>
  )
}
