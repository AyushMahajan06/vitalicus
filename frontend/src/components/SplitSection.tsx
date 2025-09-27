export default function SplitSection() {
  return (
    <section className="container split">
      {/* Left: copy panel */}
      <div className="panel stack-m">
        <div className="badge">How it works</div>
        <h2 style={{ margin: 0, fontSize: 36, letterSpacing: "-.02em" }}>
          Actionable vitals and pre-visit context in minutes.
        </h2>
        <p style={{ margin: 0, color: "var(--muted)", maxWidth: 760 }}>
          A portable buddy records heart rate, SpO₂, and temperature and syncs
          to our platform. Providers review real-time trends and AI insights
          alongside a voice-driven pre-visit questionnaire to triage urgency and
          walk into appointments informed.
        </p>
        <div className="row" style={{ gap: 12 }}>
          <button className="btn">Request Demo</button>
          <button className="btn ghost">View Docs</button>
        </div>
      </div>

      {/* Right: checklist panel */}
      <div className="panel stack-m">
        <ul className="ul">
          <CheckItem
            title="HR, SpO₂ & temperature capture"
            body="Desk buddy measures three core vitals and syncs automatically."
          />
          <CheckItem
            title="Voice pre-visit questionnaire"
            body="Yes/No/Maybe prompts create structured context for providers."
          />
          <CheckItem
            title="Real-time trends & alerts"
            body="Historical graphs, threshold notifications, and emergency routing."
          />
          <CheckItem
            title="EMR/FHIR integration"
            body="Share data with existing systems using secure, role-based access."
          />
        </ul>
      </div>
    </section>
  );
}

function CheckItem({ title, body }: { title: string; body: string }) {
  return (
    <li className="li">
      <CheckIcon />
      <div className="stack-s">
        <strong>{title}</strong>
        <span style={{ color: "var(--muted)" }}>{body}</span>
      </div>
    </li>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="url(#g)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="g" x1="0" x2="24" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  );
}
