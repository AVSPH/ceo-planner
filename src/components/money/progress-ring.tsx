interface Props {
  value: number
  max: number
  size?: number
  strokeWidth?: number
}

export function ProgressRing({ value, max, size = 96, strokeWidth = 8 }: Props) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const pct = max > 0 ? Math.min(value / max, 1) : 0

  return (
    <svg
      width={size}
      height={size}
      style={{ transform: 'rotate(-90deg)' }}
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circ * pct} ${circ}`}
        strokeLinecap="round"
        className="stroke-primary transition-all duration-700"
      />
    </svg>
  )
}
