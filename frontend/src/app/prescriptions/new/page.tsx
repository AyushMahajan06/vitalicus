'use client';

import { useState } from 'react';

// --- small UI primitives (no extra deps) ---
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="stack-s" style={{ width: '100%' }}>
      <span style={{ fontWeight: 600 }}>
        {label} {required ? <span style={{ color: '#f87171' }}>*</span> : null}
      </span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="input"
      style={{
        background: 'var(--panel)',
        color: 'var(--text)',
        border: '1px solid var(--line)',
        borderRadius: '10px',
        padding: '12px 14px',
        outline: 'none',
        width: '100%',
      }}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="select"
      style={{
        background: 'var(--panel)',
        color: 'var(--text)',
        border: '1px solid var(--line)',
        borderRadius: '10px',
        padding: '12px 14px',
        outline: 'none',
        width: '100%',
        appearance: 'none',
      }}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="textarea"
      rows={4}
      style={{
        background: 'var(--panel)',
        color: 'var(--text)',
        border: '1px solid var(--line)',
        borderRadius: '10px',
        padding: '12px 14px',
        outline: 'none',
        width: '100%',
        resize: 'vertical',
      }}
    />
  );
}

// --- timings used in dropdowns ---
const TIMING_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Every 6 hours',
  'Every 8 hours',
  'At bedtime',
  'As needed',
];

type FormState = {
  patientName: string;
  drug1Name: string;
  drug1Timing: string;
  drug2Name?: string;
  drug2Timing?: string;
  notes?: string;
};

export default function NewPrescriptionPage() {
  const [form, setForm] = useState<FormState>({
    patientName: '',
    drug1Name: '',
    drug1Timing: '',
    drug2Name: '',
    drug2Timing: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResultUrl(null);

    // minimal client-side required checks
    if (!form.patientName.trim() || !form.drug1Name.trim() || !form.drug1Timing) {
      setError('Please fill Patient Name, Drug #1 Name, and Drug #1 Timings.');
      return;
    }

    setSubmitting(true);
    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';

      // Build the payload exactly as requested
      const payload = {
        patientName: form.patientName.trim(),
        drug1Name: form.drug1Name.trim(),
        drug1Timing: form.drug1Timing,
        drug2Name: form.drug2Name?.trim() || undefined,
        drug2Timing: form.drug2Timing || undefined,
        notes: form.notes?.trim() || undefined,
      };

      // If you later add auth, include Authorization header here.
      const res = await fetch(`${backend}/api/prescriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}` // (optional, when backend requires it)
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to generate prescription');

      // Expecting backend to return { id, url } (signed URL to the PDF)
      if (data?.url) setResultUrl(data.url);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container" style={{ padding: '64px 0' }}>
      <h1 style={{ margin: 0, marginBottom: 16 }}>New Prescription</h1>
      <p style={{ marginTop: 0, color: 'var(--muted)', marginBottom: 24 }}>
        Enter prescription details to generate a PDF.
      </p>

      <form onSubmit={handleSubmit} className="stack-l" style={{ maxWidth: 720 }}>
        <Field label="Patient Name" required>
          <Input
            placeholder="e.g., Jane Doe"
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          />
        </Field>

        <div className="stack-m">
          <h3 style={{ margin: 0 }}>Drug #1</h3>
          <Field label="Drug #1 Name" required>
            <Input
              placeholder="e.g., Amoxicillin 500mg"
              value={form.drug1Name}
              onChange={(e) => setForm({ ...form, drug1Name: e.target.value })}
            />
          </Field>

          <Field label="Drug #1 Timings" required>
            <Select
              value={form.drug1Timing}
              onChange={(e) => setForm({ ...form, drug1Timing: e.target.value })}
            >
              <option value="" disabled>
                Select timing
              </option>
              {TIMING_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="stack-m">
          <h3 style={{ margin: 0 }}>Drug #2 (Optional)</h3>
          <Field label="Drug #2 Name">
            <Input
              placeholder="Optional"
              value={form.drug2Name}
              onChange={(e) => setForm({ ...form, drug2Name: e.target.value })}
            />
          </Field>

          <Field label="Drug #2 Timings">
            <Select
              value={form.drug2Timing}
              onChange={(e) => setForm({ ...form, drug2Timing: e.target.value })}
            >
              <option value="">None</option>
              {TIMING_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Notes for patient (Optional)">
          <TextArea
            placeholder="e.g., Take with food. Stop if rash develops."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Field>

        {error ? (
          <div
            style={{
              border: '1px solid #ef4444',
              background: 'rgba(239,68,68,.1)',
              color: '#fecaca',
              padding: '10px 12px',
              borderRadius: 10,
            }}
          >
            {error}
          </div>
        ) : null}

        <div className="row" style={{ gap: 12 }}>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Generating…' : 'Submit'}
          </button>
          {resultUrl ? (
            <a
              className="btn ghost"
              href={resultUrl}
              target="_blank"
              rel="noreferrer"
            >
              Download PDF
            </a>
          ) : null}
        </div>
      </form>
    </main>
  );
}
