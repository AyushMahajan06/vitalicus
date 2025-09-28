'use client';

import { useEffect, useRef, useState } from "react";
import FlipPanel from './dashboard/FlipPanel';
import StatTile from './dashboard/StatTile';
import { fetchLatestVitalsForUser, type VitalsSnapshot } from "@/lib/vitals";
import PastDataTable from './dashboard/PastDataTable';
import MetricsChart from './dashboard/MetricsChart';
import AISummary from './dashboard/AISummary';


export default function LiveStatsSection({
  userId = "demo-user",
}: {
  userId?: string;
}) {
  const [vitals, setVitals] = useState<VitalsSnapshot>({
    hr: null,
    spo2: null,
    skinTemp: null,
    transcript: null,
    ts: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const timerRef = useRef<number | null>(null);

  async function load() {
    setRefreshing(true);
    try {
      const data = await fetchLatestVitalsForUser(userId);
      setVitals(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Poll every 3 seconds and pause when tab is hidden
  useEffect(() => {
    function start() {
      load();
      timerRef.current = window.setInterval(load, 3000);
    }
    function stop() {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const onVis = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVis);
    return () => { document.removeEventListener("visibilitychange", onVis); stop(); };
  }, [userId]);

  const display = (n: number | null, unit = "") => (n == null ? "—" : `${n}${unit}`);

  return (
    <section className="container section live-dash" aria-label="Live stats dashboard">
      {/* Section title */}
      <h2 style={{ margin: 0, fontSize: 24 }}>Latest Patient Stats</h2>
      <p style={{ marginTop: 4, marginBottom: 16, color: "var(--muted)", fontSize: 14 }}>
        Last Updated: {vitals.ts ? new Date(vitals.ts).toLocaleTimeString() : "—"}
      </p>

      {/* Top 3 tiles (now live values) */}
      <div className="stat-tiles">
        {/* HR */}
        <div className="tile" aria-label="Heart Rate">
          <div className="tile-label">{loading ? "…" : display(vitals.hr, " bpm")}</div>
          <div className="tile-label" style={{ position:'absolute', bottom:12, right:16, color:'var(--muted)' }}>
            HR
          </div>
        </div>

        {/* SpO2 */}
        <div className="tile" aria-label="SpO2">
          <div className="tile-label">{loading ? "…" : display(vitals.spo2, "%")}</div>
          <div className="tile-label" style={{ position:'absolute', bottom:12, right:16, color:'var(--muted)' }}>
            SpO₂
          </div>
        </div>

        {/* Temp */}
        <div className="tile" aria-label="Temperature">
          <div className="tile-label">
            {loading
              ? "…"
              : vitals.skinTemp == null
                ? "—"
                : display(parseFloat(((vitals.skinTemp * 9) / 5 + 32).toFixed(1)), " °F")}
          </div>
          <div
            className="tile-label"
            style={{ position: "absolute", bottom: 12, right: 16, color: "var(--muted)" }}
          >
            Temp
          </div>
        </div>
      </div> {/* <-- close stat-tiles */}

      {/* AI Summary <-> Patient's Transcript */}
      <FlipPanel
        frontTitle="AI Summary"
        backTitle="Patient's Transcript"
        minHeight={260}
        front={
          <AISummary
            transcript={vitals.transcript}
            vitals={{ hr: vitals.hr, spo2: vitals.spo2, tempC: vitals.skinTemp }}
          />
        }
        back={
          <div className="flip-body flip-scroll" style={{ textAlign: 'left' }}>
            {vitals.transcript && vitals.transcript.trim().length > 0
              ? 
              <p style={{ margin:0, whiteSpace:'pre-wrap' }}><strong className="ai-summary-title">Patient's Transcript: <br></br></strong><br></br>"{vitals.transcript}"</p>
              : <span className="flip-title">Patient's Transcript (empty)</span>}
          </div>
        }
      />

      {/* Graph <-> Past Data (placeholders) */}
      <FlipPanel
        frontTitle="Graph"
        backTitle="Past Data"
        minHeight={400}
        front={<MetricsChart />}
        back={<PastDataTable />}
      />

      <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 13 }} aria-live="polite">
        {refreshing ? "Refreshing…" : ""}
      </div>
    </section>
  );
}
