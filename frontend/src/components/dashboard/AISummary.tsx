'use client';

import { useState } from 'react';

export type AISummaryProps = {
  transcript: string | null;
  vitals: { hr: number | null; spo2: number | null; tempC: number | null };
};

export default function AISummary({ transcript, vitals }: AISummaryProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, vitals }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to generate');
      setSummary((data.summary || '').trim());
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const hasSummary = summary.length > 0;

  // ---------- EMPTY (initial) STATE: perfectly centered ----------
  if (!hasSummary) {
    return (
      <div className="ai-summary-root">
        <div className="ai-summary-empty">
          <div className="ai-summary-empty-inner">
            <button
              className="btn gradient"
              onClick={generate}
              disabled={loading || !transcript || transcript.trim().length === 0}
              aria-label="Generate AI Summary"
            >
              {loading ? 'Generating…' : 'Generate'}
            </button>
            <p className="ai-summary-hint">
              {loading
                ? 'Summarizing…'
                : 'Click Generate to summarize the patient transcript and vitals.'}
            </p>
            {error ? (
              <div className="ai-summary-error">{error}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // ---------- AFTER FIRST SUMMARY ----------
  return (
    <div className="ai-summary-root">
      <header className="ai-summary-header has-summary" aria-label="AI Summary header">
        <strong className="ai-summary-title">AI Summary</strong>
        <button
          className="btn gradient"
          onClick={generate}
          disabled={loading}
          aria-label="Regenerate AI Summary"
        >
          {loading ? 'Generating…' : 'Regenerate'}
        </button>
      </header>

      <section className="ai-summary-content" aria-live="polite">
        {error ? <div className="ai-summary-error">{error}</div> : null}
        <div style={{ whiteSpace: 'pre-wrap' }}>{summary}</div>
      </section>
    </div>
  );
}
