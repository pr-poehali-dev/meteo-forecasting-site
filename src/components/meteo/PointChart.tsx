import { useMemo } from 'react';
import { MeteoLayer } from '@/data/meteo';

/** Мини-график изменения параметра по времени для выбранной точки */
const PointChart = ({ layer, seed }: { layer: MeteoLayer; seed: number }) => {
  const points = useMemo(() => {
    let s = (seed + layer.n * 91) % 2147483647 || 1;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const N = 24;
    const vals: number[] = [];
    let base = 0.3 + rnd() * 0.3;
    for (let i = 0; i < N; i++) {
      base += (rnd() - 0.5) * 0.28;
      base = Math.max(0.05, Math.min(0.98, base));
      vals.push(base);
    }
    return vals;
  }, [layer, seed]);

  const W = 100;
  const H = 40;
  const path = points
    .map((v, i) => `${(i / (points.length - 1)) * W},${H - v * H}`)
    .join(' ');
  const area = `0,${H} ${path} ${W},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-14 w-full">
      <defs>
        <linearGradient id={`g-${layer.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(190 95% 55%)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="hsl(190 95% 55%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#g-${layer.id})`} />
      <polyline
        points={path}
        fill="none"
        stroke="hsl(190 95% 55%)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default PointChart;
