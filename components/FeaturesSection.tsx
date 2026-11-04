const FEATURES = [
  { num: '01', title: 'Zero-latency DSP', desc: 'Hand-tuned algorithms run at 32-bit float, 96kHz internal. Trackable from input to bus.' },
  { num: '02', title: 'Universal formats', desc: 'VST3 · AU · AAX. macOS 12+, Apple Silicon native. Windows 10/11, 64-bit only.' },
  { num: '03', title: 'Lifetime updates', desc: 'Buy once. Every release on the roadmap is yours, including the v3.x rewrite landing this fall.' },
  { num: '04', title: 'Studio licensing', desc: 'Three machines per seat. Transfer between rigs as your studio grows. No cloud check-ins.' },
]

export function FeaturesSection() {
  return (
    <>
      <div className="section-head">
        <div className="section-num">[03 / DETAILS]</div>
        <div className="section-title">The fine print — what&apos;s in every Corino plugin.</div>
        <div className="section-aside">PAGE 04 OF 04</div>
      </div>
      <section className="features">
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.num} className="feature">
              <div className="feature-num">{f.num}</div>
              <div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
