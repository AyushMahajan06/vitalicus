// lib/history.ts
'use client';

import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  getDatabase,
  ref,
  child,
  onValue,
  push,
  off,
  DataSnapshot,
} from 'firebase/database';

// Reuse your NEXT_PUBLIC_* envs
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
const auth = getAuth(app);
const rtdb = getDatabase(app);

type HistoryPoint = {
  ts: number;                // we upload the time ourselves
  hr: number | null;
  spo2: number | null;
  temp: number | null;
  text: string | null;
};

// tiny helper
const toNumber = (v: unknown): number | null => {
  const n = typeof v === 'string' ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : null;
};

// Ensure we’re signed in (needed if rules require auth != null)
async function ensureAuth(): Promise<void> {
  if (auth.currentUser) return;
  await new Promise<void>((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) { unsub(); resolve(); }
    });
    signInAnonymously(auth).catch(() => {/* best-effort in demo */});
  });
}

/**
 * startVitalsHistory
 * - Subscribes to the live sensor paths you already use
 * - Every 5s, writes one combined object to /history ONLY if values changed
 * - Returns a cleanup fn to stop
 */
export async function startVitalsHistory(intervalMs = 5000): Promise<() => void> {
  await ensureAuth();

  const root = ref(rtdb);

  const heartRef = child(root, 'sensors/heart');
  const dhtRef   = child(root, 'sensors/dht11');
  const textRoot = child(root, 'text');
  const textAlt  = child(root, 'sensors/text'); // fallback if you move it

  // hold the latest live values (we don’t mutate your current live paths)
  const latest: HistoryPoint = { ts: Date.now(), hr: null, spo2: null, temp: null, text: null };

  const handleHeart = (snap: DataSnapshot) => {
    const v = (snap.exists() ? snap.val() : {}) as any;
    latest.hr   = toNumber(v?.bpm);
    latest.spo2 = toNumber(v?.spo2);
  };
  const handleDht = (snap: DataSnapshot) => {
    const v = (snap.exists() ? snap.val() : {}) as any;
    latest.temp = toNumber(v?.temperature);
  };
  const handleText = (snap: DataSnapshot) => {
    if (snap.exists()) {
      const raw = snap.val();
      latest.text = typeof raw === 'string' ? raw : null;
    }
  };

  // subscribe to live changes
  onValue(heartRef, handleHeart);
  onValue(dhtRef, handleDht);
  onValue(textRoot, handleText);
  onValue(textAlt, handleText); // harmless if missing

  // change detection signature (ignore ts so a stable reading doesn’t spam)
  let lastSig: string | null = null;
  const makeSig = (p: HistoryPoint) => JSON.stringify({ hr: p.hr, spo2: p.spo2, temp: p.temp, text: p.text });

  const timer = window.setInterval(async () => {
    const point: HistoryPoint = {
      ts: Date.now(),             // we upload the time ourselves
      hr: latest.hr,
      spo2: latest.spo2,
      temp: latest.temp,
      text: latest.text ?? null,
    };

    const sig = makeSig(point);
    if (sig !== lastSig) {
      lastSig = sig;
      try {
        await push(child(root, 'history'), point);
      } catch (e) {
        // swallow errors in demo mode; optionally console.error(e)
      }
    }
  }, intervalMs);

  // cleanup
  return () => {
    off(heartRef, 'value', handleHeart);
    off(dhtRef, 'value', handleDht);
    off(textRoot, 'value', handleText);
    off(textAlt, 'value', handleText);
    window.clearInterval(timer);
  };
}
