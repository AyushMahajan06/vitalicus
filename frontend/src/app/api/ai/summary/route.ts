// app/api/ai/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SYSTEM_PROMPT =
  'You are an assistant to a nurse, receiving patient vitals and transcripts of their statements. Summarize and highlight key issues, actionable concerns, and positive outcomes, repeating any important details explicitly. Ensure clarity, accuracy, and neutral language, and flag critical changes or urgent topics for follow-up. Do not make any diagnoses';

type Body = {
  transcript?: string | null;
  vitals?: { hr?: number | null; spo2?: number | null; tempC?: number | null };
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not set' }, { status: 500 });
    }

    const { transcript, vitals }: Body = await req.json();

    const userMessage =
      `Using the rules above, create a concise nursing-facing summary with bullet points.\n\n` +
      `PATIENT TRANSCRIPT (primary source):\n${transcript?.trim() || '(none provided)'}\n\n` +
      `CURRENT VITALS (secondary, for context):\n` +
      `• HR: ${vitals?.hr ?? '—'} bpm\n` +
      `• SpO₂: ${vitals?.spo2 ?? '—'} %\n` +
      `• Temp: ${vitals?.tempC ?? '—'} °C\n` +
      `\nMake sure to: (1) repeat important patient statements explicitly, (2) list actionable concerns first, (3) include positive/normal findings, and (4) flag anything urgent clearly (without diagnosing). Always answer in 1 small paragraph with no text editing. Always display temperature in Fahrenheit.`;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 350,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => '');
      return NextResponse.json({ error: `OpenAI error: ${resp.status} ${err}` }, { status: 500 });
    }

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || '';
    return NextResponse.json({ summary: text });
  } catch (e: any) {
    return NextResponse.json({ error: 'AI summary failed' }, { status: 500 });
  }
}
