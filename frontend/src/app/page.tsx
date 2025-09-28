'use client';

import { useEffect, useState } from 'react';
import { startVitalsHistory } from '@/lib/history';

import Hero from '@/components/Hero';
import LiveStatsSection from '@/components/LiveStatsSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [historyOn, setHistoryOn] = useState(false);

  useEffect(() => {
    let stop: undefined | (() => void);
    if (historyOn) {
      (async () => {
        stop = await startVitalsHistory(5000);
      })();
    }
    return () => {
      if (stop) stop();
    };
  }, [historyOn]);

  return (
    <>
      <Hero />

      {/* Live stats section */}
      <LiveStatsSection userId="demo-user" />

      {/* Graphs shell + prescription action */}
      <section className="container graphs-section">
        <div className="actions-row">
          <a className="btn gradient" href="/prescriptions/new">
            Generate Prescription
          </a>
        </div>
      </section>

      <Footer />

      {/* Meta toggle */}
      <div
        style={{
          marginTop: 32,
          padding: '12px 16px',
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: 13,
        }}
      >
        <label style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={historyOn}
            onChange={(e) => setHistoryOn(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          META: Write to History
        </label>
      </div>
    </>
  );
}
