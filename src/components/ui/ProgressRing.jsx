export default function ProgressRing({ value, max, label, sublabel, size = 172 }) {
  const progress = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <div
      className="goal-ring"
      style={{
        width: size,
        height: size,
        "--ring-progress": `${Math.max(progress * 360, 2)}deg`,
      }}
      aria-label={`${label} ${value}/${max}`}
    >
      <span>
        <strong>{value}<small> / {max}</small></strong>
        <em>{sublabel}</em>
      </span>
    </div>
  );
}
