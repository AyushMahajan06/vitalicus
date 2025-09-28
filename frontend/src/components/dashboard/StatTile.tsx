export default function StatTile({ label }: { label: string }) {
  return (
    <div className="tile" aria-label={label}>
      <div className="tile-label">{label}</div>
    </div>
  );
}
