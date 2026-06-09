type Props = {
  current: number;
  max: number;
};

export default function HealthBar({
  current,
  max,
}: Props) {
  const percent = Math.max(
    0,
    Math.min(
      100,
      (current / max) * 100
    )
  );

  let color =
    "bg-green-500";

  if (percent < 50) {
    color =
      "bg-yellow-500";
  }

  if (percent < 25) {
    color =
      "bg-red-500";
  }

  return (
    <div className="w-64 overflow-hidden rounded border">
      <div
        className={`h-4 transition-all duration-500 ${color}`}
        style={{
          width: `${percent}%`,
        }}
      />
    </div>
  );
}