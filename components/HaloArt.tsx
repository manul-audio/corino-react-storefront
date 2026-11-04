const N = 32
// Fixed precision: server and browser engines can differ in the last digit of
// Math.sin and **, which would make these style strings mismatch at hydration.
const BARS = Array.from({ length: N }, (_, i) => {
  const t = i / N
  const h = Math.sin(t * Math.PI) ** 0.6 * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.3)))
  return {
    height: `${(h * 100).toFixed(2)}%`,
    background: `oklch(${(0.6 + h * 0.25).toFixed(3)} 0.18 ${(50 + i * 1.5).toFixed(1)} / 0.85)`,
  }
})

const RINGS = [
  { width: '2916.67%', opacity: 0.5, borderColor: 'oklch(0.78 0.16 60 / 0.55)' },
  { width: '3541.67%', opacity: 0.4, borderColor: 'oklch(0.78 0.16 56 / 0.45)' },
  { width: '4166.67%', opacity: 0.3, borderColor: 'oklch(0.78 0.16 52 / 0.35)' },
  { width: '4895.83%', opacity: 0.2, borderColor: 'oklch(0.78 0.16 48 / 0.25)' },
]

export function HaloArt() {
  return (
    <div>
      <div className="halo-grid" />
      {RINGS.map((ring, i) => <div key={i} className="halo-ring" style={ring} />)}
      <div className="halo-sun" />
      <div className="halo-horizon" />
      <div className="halo-bars">
        {BARS.map((bar, i) => <div key={i} style={bar} />)}
      </div>
    </div>
  )
}
