/**
 * RTDB vitals fetcher (temp mapping):
 * - humidity -> hr
 * - temperature -> skinTemp
 * - spo2 -> null (not present)
 */

import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_FB_DB_URL!, // MUST be set
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const auth = getAuth(app);

// Ensure we are signed in (needed if rules require auth != null)
let authReady: Promise<void> | null = null;
function ensureAuth(): Promise<void> {
  if (authReady) return authReady;
  authReady = new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        // console.log("[vitals] signed in:", u.uid);
        unsub();
        resolve();
      } else {
        signInAnonymously(auth).catch((e) => {
          console.error("[vitals] anonymous sign-in failed:", e);
        });
      }
    });
  });
  return authReady;
}

export type VitalsSnapshot = {
  hr: number | null;
  spo2: number | null;
  skinTemp: number | null;
  ts: number | null;
};

export async function fetchLatestVitalsForUser(_uid: string): Promise<VitalsSnapshot> {
  try {
    // authenticate first (no-op if already signed in)
    await ensureAuth();

    const root = ref(rtdb);
    const dhtSnap = await get(child(root, "sensors/dht11"));
    const dht = dhtSnap.exists() ? (dhtSnap.val() as any) : {};

    const humidity = toNumber(dht?.humidity);
    const temperature = toNumber(dht?.temperature);

    // console.log("[vitals] RTDB:", { humidity, temperature, raw: dht });

    return {
      hr: humidity,          // TEMP: show humidity where “Heart Rate” goes
      spo2: null,            // not in your RTDB sample
      skinTemp: temperature, // temperature shown correctly
      ts: Date.now(),
    };
  } catch (e) {
    console.error("[vitals] fetch failed:", e);
    return { hr: null, spo2: null, skinTemp: null, ts: null };
  }
}

function toNumber(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : null;
}
