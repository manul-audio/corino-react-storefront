const LABELS = ['Polara', 'Northbound', 'Halsted Records', 'Cassette Bureau', 'Indigo Lane', 'Veil Studios']

export function TrustSection() {
  return (
    <section className="trust">
      <div className="trust-eyebrow">Heard on records from</div>
      <div className="trust-row">
        {LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </section>
  )
}
