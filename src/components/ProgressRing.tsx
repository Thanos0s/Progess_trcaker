type Props = {
  pct: number;
  size?: number;
  stroke?: number;
  label?: string;
  color?: string;
};

export function ProgressRing({ pct, size = 72, stroke = 7, label, color = "hsl(var(--accent))" }: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, pct)) / 100);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-mono text-sm font-bold">{pct}%</div>
        {label ? <div className="text-[9px] uppercase tracking-wider text-muted">{label}</div> : null}
      </div>
    </div>
  );
}
