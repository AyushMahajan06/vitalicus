'use client';

import { useEffect, useRef, useState } from "react";
import HeartRateCard from "./vitals/HeartRateCard";
import SpO2Card from "./vitals/SpO2Card";
import SkinTempCard from "./vitals/SkinTempCard";
import { fetchLatestVitalsForUser, type VitalsSnapshot } from "@/lib/vitals";

function RefreshIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        transform: spinning ? "rotate(360deg)" : "none",
        transition: "transform 0.6s ease",
      }}
      aria-hidden
    >
      <path
        d="M20 12a8 8 0 1 1-2.34-5.66"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M20 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function LiveStatsSection({
  userId = "demo-user", // TODO: pass the actual patient/user UID from auth or route
  tempUnit = "°C",
}: {
  userId?: string;
  tempUnit?: "°C" | "°F" | string;
}) {
  const [vitals, setVitals] = useState<VitalsSnapshot>({
    hr: null,
    spo2: null,
    skinTemp: null,
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

  // Poll every 3 seconds
  useEffect(() => {
    // initial load immediately
    load();

    timerRef.current = window.setInterval(load, 3000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const lastUpdated =
    vitals.ts ? new Date(vitals.ts).toLocaleTimeString() : "—";

  return (
    <section className="container" style={{ marginTop: 32 }}>
      <div className="row" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Latest Patient Vitals</h2>
        <button
          className="btn ghost"
          onClick={load}
          aria-label="Refresh vitals"
          style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <RefreshIcon spinning={refreshing} />
          Refresh
        </button>
      </div>

      <div className="stats-grid">
        <HeartRateCard value={vitals.hr} loading={loading} />
        <SpO2Card value={vitals.spo2} loading={loading} />
        <SkinTempCard value={vitals.skinTemp} loading={loading} unit={tempUnit} />
      </div>

      <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 13 }}>
        Last updated: {lastUpdated}
      </div>
    </section>
  );
}
