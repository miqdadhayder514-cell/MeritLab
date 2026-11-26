export function Sparkline({
  values,
  color = "#2563eb",
  fill = true,
}: {
  values: number[];
  color?: string;
  fill?: boolean;
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 40 - ((value - min) / Math.max(max - min, 1)) * 34;
      return `${x},${y}`;
    })
    .join(" ");
  const area = `0,42 ${points} 100,42`;
  return (
    <svg
      className="sparkline"
      viewBox="0 0 100 44"
      preserveAspectRatio="none"
      aria-label="Performance trend"
    >
      {fill && <polygon points={area} fill={color} opacity=".09" />}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function PerformanceChart({ compact = false }: { compact?: boolean }) {
  const points = "0,75 10,66 20,70 30,52 40,57 50,37 60,45 70,29 80,36 90,17 100,21";
  return (
    <div className={`performance-chart ${compact ? "chart-compact" : ""}`}>
      <div className="chart-y-labels">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-label="Weekly accuracy chart"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity=".18" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="#edf1f6"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <polygon points={`0,100 ${points} 100,100`} fill="url(#chartFill)" />
        <polyline
          points={points}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="90"
          cy="17"
          r="2"
          fill="#fff"
          stroke="#2563eb"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="chart-x-labels">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

export function DonutChart({
  value = 72,
  label = "Accuracy",
}: {
  value?: number;
  label?: string;
}) {
  return (
    <div className="donut-wrap" role="img" aria-label={`${label}: ${value}%`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="47" fill="none" stroke="#edf1f6" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="47"
          fill="none"
          stroke="#16a085"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 295.3} 295.3`}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="donut-label">
        <strong>{value}%</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export function Bars({ values, labels }: { values: number[]; labels: string[] }) {
  return (
    <div className="bars-chart" role="img" aria-label="Weekly study progress">
      {values.map((value, i) => (
        <div className="bar-col" key={labels[i]}>
          <div className="bar-space">
            <span style={{ height: `${value}%` }} />
          </div>
          <small>{labels[i]}</small>
        </div>
      ))}
    </div>
  );
}
