/**
 * RTDB vitals fetcher (real mapping):
 * - sensors/heart/bpm     -> hr
 * - sensors/heart/spo2    -> spo2
 * - sensors/dht11/temperature -> skinTemp
 * - text (root)           -> transcript
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
  transcript: string | null;
  ts: number | null;
};

export async function fetchLatestVitalsForUser(_uid: string): Promise<VitalsSnapshot> {
  try {
    await ensureAuth();

    const root = ref(rtdb);

    // Reads
    const heartSnap = await get(child(root, "sensors/heart"));
    const dhtSnap   = await get(child(root, "sensors/dht11"));

    // Try both places for transcript: root /text and /sensors/text
    const textRootSnap   = await get(child(root, "text"));
    const textSensorSnap = await get(child(root, "sensors/text"));

    const heart = heartSnap.exists() ? (heartSnap.val() as any) : {};
    const dht   = dhtSnap.exists()   ? (dhtSnap.val()   as any) : {};

    // Prefer /text; fallback to /sensors/text
    let transcriptRaw: unknown = null;
    if (textRootSnap.exists()) {
      transcriptRaw = textRootSnap.val();
    } else if (textSensorSnap.exists()) {
      transcriptRaw = textSensorSnap.val();
    }

    const hr       = toNumber(heart?.bpm);
    const spo2     = toNumber(heart?.spo2);
    const skinTemp = toNumber(dht?.temperature);

    // Normalize transcript to a non-empty string or null
    const transcript =
      typeof transcriptRaw === "string"
        ? transcriptRaw.trim() || null
        : null;

    // Uncomment for quick debugging in the browser console:
    // console.log("[vitals]", { hr, spo2, skinTemp, transcript, from:
    //   textRootSnap.exists() ? "/text" : textSensorSnap.exists() ? "/sensors/text" : "none"
    // });

    return { hr, spo2, skinTemp, transcript, ts: Date.now() };
  } catch (e) {
    console.error("[vitals] fetch failed:", e);
    return { hr: null, spo2: null, skinTemp: null, transcript: null, ts: null };
  }
}

function toNumber(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : null;
}
