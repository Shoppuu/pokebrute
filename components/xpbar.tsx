type Props = {
  current: number;
  max: number;
};

export default function XpBar({
  current,
  max,
}: Props) {
  const percent =
    Math.min(
      100,
      (current / max) * 100
    );

  return (
    <div className="w-64 rounded border">
      <div
        className="h-4 bg-blue-500 transition-all duration-500"
        style={{
          width: `${percent}%`,
        }}
      />
    </div>
  );
}