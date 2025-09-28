'use client';

import { useEffect, useState } from 'react';
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
  temp: number | null;
  text: string | null;
};

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

export default function PastDataTable() {
  const [rows, setRows] = useState<Row[]>([]);

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
        .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0)); // newest first
      setRows(arr);
    });
    return () => {
      off(q, 'value', unsub as any);
    };
  }, []);

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString();
  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString();
  const toF = (c: number | null) => (c == null ? null : (c * 9) / 5 + 32);

  return (
    <div className="table-scroll" aria-label="Past vitals data">
      <div className="table-title">Past Data</div>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Date</th>
            <th style={{ width: '20%' }}>Time</th>
            <th style={{ width: '20%' }}>HR</th>
            <th style={{ width: '20%' }}>SpO₂</th>
            <th style={{ width: '20%' }}>Temp</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ color: 'var(--muted)' }}>
                No history yet.
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => {
              const tempF = toF(r.temp);
              return (
                <tr key={`${r.ts}-${idx}`}>
                  <td>{r.ts ? formatDate(r.ts) : '—'}</td>
                  <td>{r.ts ? formatTime(r.ts) : '—'}</td>
                  <td>{r.hr ?? '—'}</td>
                  <td>{r.spo2 ?? '—'}</td>
                  <td>{tempF == null ? '—' : `${tempF.toFixed(1)} °F`}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
