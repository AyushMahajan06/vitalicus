'use client';

import { useEffect, useMemo, useState } from 'react';
import { getApps, initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  limitToLast,
  onValue,
  off,
} from 'firebase/database';

type Row = {
  ts: number;
  hr: number | null;
  spo2: number | null;
  temp: number | null; // °C in /history
};

type Metric = 'HR' | 'SpO2' | 'Temp';

// Firebase init (reuse NEXT_PUBLIC_* envs)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_FB_DB_URL!,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function MetricsChart() {
  const [rows, setRows] = useState<Row[]>([]);
  const [metric, setMetric] = useState<Metric>('HR');

  useEffect(() => {
    const q = query(ref(db, 'history'), orderByChild('ts'), limitToLast(20));
    const unsub = onValue(q, (snap) => {
      if (!snap.exists()) {
        setRows([]);
        return;
      }
      const val = snap.val() as Record<string, Row>;
      const arr = Object.values(val)
        .filter(Boolean)
        .sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0)); // oldest -> newest
      setRows(arr);
    });
    return () => {
      off(q, 'value', unsub as any);
    };
  }, []);

  // Chart dims
  const padding = { top: 18, right: 12, bottom: 28, left: 40 };
  const viewW = 960;
  const viewH = 360;
  const innerW = viewW - padding.left - padding.right;
  const innerH = viewH - padding.top - padding.bottom;

  // Metric config
  const yConfig = useMemo(() => {
    if (metric === 'HR') return { min: 40, max: 170, label: 'bpm' };
    if (metric === 'SpO2') return { min: 20, max: 100, label: '%' };
    return { min: 0, max: 1, label: '' }; // Temp shows notice
  }, [metric]);

  // Extract series
  const series = useMemo(() => {
    const vals = rows.map((r) =>
      metric === 'HR' ? r.hr : metric === 'SpO2' ? r.spo2 : r.temp
    );
    const times = rows.map((r) => r.ts);
    return { vals, times };
  }, [rows, metric]);

  // Scales
  const x = (i: number) => {
    if (rows.length <= 1) return padding.left + innerW / 2;
    return padding.left + (i / (rows.length - 1)) * innerW;
  };
  const y = (v: number) => {
    const { min, max } = yConfig;
    const t = (v - min) / (max - min);
    return padding.top + (1 - Math.max(0, Math.min(1, t))) * innerH;
  };

  // Valid datapoints
  const validIdx: number[] = useMemo(
    () =>
      series.vals
        .map((v, i) => (v == null || isNaN(v as number) ? -1 : i))
        .filter((i) => i >= 0),
    [series.vals]
  );

  // Path
  const pathD = useMemo(() => {
    if (metric === 'Temp' || validIdx.length === 0) return '';
    const pts: string[] = [];
    validIdx.forEach((i, k) => {
      const cmd = k === 0 ? 'M' : 'L';
      pts.push(`${cmd}${x(i)},${y(series.vals[i] as number)}`);
    });
    return pts.join(' ');
  }, [series.vals, validIdx, metric]);

  // Y grid ticks
  const ticks = 5;
  const yTicks = useMemo(() => {
    const ys = [];
    for (let i = 0; i <= ticks; i++) {
      const t = i / ticks;
      const val = yConfig.min + (1 - t) * (yConfig.max - yConfig.min);
      const py = padding.top + t * innerH;
      ys.push({ py, val: Math.round(val) });
    }
    return ys;
  }, [yConfig, innerH, padding.top]);

  // X labels
  const xLabels = useMemo(() => {
    if (series.times.length === 0) return [];
    const first = series.times[0];
    const mid = series.times[Math.floor(series.times.length / 2)];
    const last = series.times[series.times.length - 1];
    return [
      { x: x(0), label: new Date(first).toLocaleTimeString() },
      { x: x(Math.floor(series.times.length / 2)), label: new Date(mid).toLocaleTimeString() },
      { x: x(series.times.length - 1), label: new Date(last).toLocaleTimeString() },
    ];
  }, [series.times]);

  return (
    <div className="chart-card">
      {/* Controls */}
      <div className="chart-controls" role="tablist" aria-label="Select metric">
        <button
          className="segmented-btn"
          aria-pressed={metric === 'HR'}
          onClick={() => setMetric('HR')}
        >
          HR
        </button>
        <button
          className="segmented-btn"
          aria-pressed={metric === 'SpO2'}
          onClick={() => setMetric('SpO2')}
        >
          SpO₂
        </button>
        <button
          className="segmented-btn"
          aria-pressed={metric === 'Temp'}
          onClick={() => setMetric('Temp')}
        >
          Temp
        </button>
      </div>

      {metric === 'Temp' ? (
        <div className="notice">
          <strong>Proof of Concept only:</strong> We had to use an environmental temperature sensor
          because our IR Temp Sensor did not arrive in time for the hackathon.
        </div>
      ) : validIdx.length === 0 ? (
        <div className="notice">No data to plot yet.</div>
      ) : (
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          preserveAspectRatio="none"
          className="chart-svg"
          role="img"
          aria-label={`${metric} over time`}
        >
          {/* Grid */}
          <g className="chart-grid">
            {yTicks.map((t, i) => (
              <line
                key={i}
                x1={padding.left}
                x2={padding.left + innerW}
                y1={t.py}
                y2={t.py}
              />
            ))}
            {/* vertical guides at first/mid/last */}
            <line x1={padding.left} x2={padding.left} y1={padding.top} y2={padding.top + innerH} />
            <line
              x1={padding.left + innerW / 2}
              x2={padding.left + innerW / 2}
              y1={padding.top}
              y2={padding.top + innerH}
            />
            <line
              x1={padding.left + innerW}
              x2={padding.left + innerW}
              y1={padding.top}
              y2={padding.top + innerH}
            />
          </g>

          {/* Axes */}
          <line
            className="chart-axis"
            x1={padding.left}
            x2={padding.left}
            y1={padding.top}
            y2={padding.top + innerH}
          />
          <line
            className="chart-axis"
            x1={padding.left}
            x2={padding.left + innerW}
            y1={padding.top + innerH}
            y2={padding.top + innerH}
          />

          {/* Y tick labels */}
          {yTicks.map((t, i) => (
            <text
              key={i}
              x={padding.left - 8}
              y={t.py + 4}
              textAnchor="end"
              className="chart-label"
            >
              {t.val}
            </text>
          ))}

          {/* X labels (first, mid, last) */}
          {xLabels.map((xl, i) => (
            <text
              key={i}
              x={xl.x}
              y={padding.top + innerH + 18}
              textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}
              className="chart-label"
            >
              {xl.label}
            </text>
          ))}

          {/* Series path */}
          <defs>
            <linearGradient id="gLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#48b8d4" />
              <stop offset="100%" stopColor="#d13875" />
            </linearGradient>
          </defs>
          <path className="chart-path" d={pathD} stroke="url(#gLine)" />

          {/* Point markers */}
          <g>
            {validIdx.map((i) => {
              const vx = x(i);
              const vy = y(series.vals[i] as number);
              return (
                <circle
                  key={`pt-${i}`}
                  cx={vx}
                  cy={vy}
                  r="3.5"
                  fill="#0f1520"
                  stroke="#d13875"
                  strokeWidth="2"
                />
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
}
