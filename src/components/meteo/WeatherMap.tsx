import { useMemo } from 'react';
import { MeteoLayer, Region } from '@/data/meteo';

interface WeatherMapProps {
  layer: MeteoLayer;
  region: Region;
  frame: number;
  className?: string;
}

/** Псевдослучайное поле данных — детерминировано по слою/региону/кадру */
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const COLS = 22;
const ROWS = 14;

const WeatherMap = ({ layer, region, frame, className }: WeatherMapProps) => {
  const seedBase =
    layer.id.length * 31 + region.id.length * 17 + layer.n * 101 + region.center.length * 7;

  const cells = useMemo(() => {
    const rnd = seeded(seedBase + frame * 13);
    // 2-3 очага активности
    const cores = Array.from({ length: 2 + Math.floor(rnd() * 2) }, () => ({
      x: rnd() * COLS,
      y: rnd() * ROWS,
      r: 2.5 + rnd() * 4,
      power: 0.6 + rnd() * 0.4,
    }));
    const out: { i: number; v: number }[] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        let v = 0;
        for (const c of cores) {
          const d = Math.hypot(x - c.x, y - c.y);
          v += Math.max(0, 1 - d / c.r) * c.power;
        }
        v = Math.min(1, v + rnd() * 0.08);
        out.push({ i: y * COLS + x, v });
      }
    }
    return out;
  }, [seedBase, frame]);

  const colorAt = (v: number) => {
    if (v < 0.06) return 'transparent';
    const idx = Math.min(layer.legend.length - 1, Math.floor(v * layer.legend.length));
    return layer.legend[idx].color;
  };

  return (
    <div className={`relative overflow-hidden rounded-lg bg-[#0a1420] scanline ${className ?? ''}`}>
      {/* координатная сетка */}
      <div className="absolute inset-0 grid-texture opacity-60" />

      {/* поле данных */}
      <div
        className="absolute inset-0 grid gap-0"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {cells.map((c) => (
          <div
            key={c.i}
            style={{
              background: colorAt(c.v),
              opacity: c.v < 0.06 ? 0 : 0.42 + c.v * 0.5,
              filter: 'blur(0.5px)',
              transition: 'background 0.5s ease, opacity 0.5s ease',
            }}
          />
        ))}
      </div>

      {/* контур региона (стилизованная рамка) */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path
          d="M8,20 L34,10 L62,14 L88,26 L92,58 L74,86 L40,92 L14,74 L6,46 Z"
          fill="none"
          stroke="hsl(190 95% 55% / 0.55)"
          strokeWidth="0.6"
          strokeDasharray="2 1.4"
        />
      </svg>

      {/* метки координат */}
      <div className="pointer-events-none absolute left-2 top-2 font-mono-data text-[10px] tracking-widest text-primary/70">
        {region.full.toUpperCase()}
      </div>
      <div className="pointer-events-none absolute bottom-2 right-2 font-mono-data text-[10px] text-muted-foreground">
        ● {region.center}
      </div>
    </div>
  );
};

export default WeatherMap;
