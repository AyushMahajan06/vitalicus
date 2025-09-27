export default function CTASection() {
  return (
    <section className="container cta-panel row">
      <div className="stack-s" style={{ maxWidth: 720 }}>
        <h3 style={{ margin: 0, fontSize: 28 }}>Ready to pilot Patient Desk Buddy?</h3>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          See the device + platform flow: live vitals, AI insights, provider
          dashboard, alerts, and EMR-ready exports.
        </p>
      </div>
      <div className="row" style={{ gap: 12 }}>
        <button className="btn">Request Demo</button>
        <button className="btn ghost">Contact</button>
      </div>
    </section>
  );
}
