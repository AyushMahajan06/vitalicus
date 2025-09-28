import VitalCard from "./VitalCard";

export default function HeartRateCard({
  value,
  loading,
}: {
  value: number | null;
  loading?: boolean;
}) {
  return <VitalCard label="Heart Rate" value={value} unit="bpm" loading={loading} />;
}
