export default function VitalCard({
  label,
  value,
  unit,
  loading,
}: {
  label: string;
  value: number | null;
  unit?: string;
  loading?: boolean;
}) {
  return (
    <article className="panel" style={{ padding: 16 }}>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
        <strong style={{ fontSize: 32 }}>
          {loading ? "—" : value ?? "—"}
        </strong>
        {unit ? <span style={{ color: "var(--muted)" }}>{unit}</span> : null}
      </div>
    </article>
  );
}
