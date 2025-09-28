import VitalCard from "./VitalCard";

export default function SpO2Card({
  value,
  loading,
}: {
  value: number | null;
  loading?: boolean;
}) {
  return <VitalCard label="SpO₂" value={value} unit="%" loading={loading} />;
}
