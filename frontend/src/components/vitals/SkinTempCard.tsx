import VitalCard from "./VitalCard";

export default function SkinTempCard({
  value,
  loading,
  unit = "°C", // switch to "°F" if your data is in Fahrenheit
}: {
  value: number | null;
  loading?: boolean;
  unit?: "°C" | "°F" | string;
}) {
  return <VitalCard label="Skin Temperature" value={value} unit={unit} loading={loading} />;
}
