import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import WeatherMap from '@/components/meteo/WeatherMap';
import Legend from '@/components/meteo/Legend';
import PointChart from '@/components/meteo/PointChart';
import { LAYERS, REGIONS, ALERTS } from '@/data/meteo';

const TOTAL_FRAMES = 48;

function frameLabel(frame: number) {
  const now = new Date('2026-07-01T00:00:00');
  const d = new Date(now.getTime() + frame * 3600 * 1000);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = String(d.getMonth() + 1).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  return `${day}.${mon} ${h}:00`;
}

const Index = () => {
  const [activeLayer, setActiveLayer] = useState(LAYERS[0]);
  const [region, setRegion] = useState(REGIONS[0]);
  const [frame, setFrame] = useState(6);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [archiveDay, setArchiveDay] = useState(0);

  const compareLayer = useMemo(
    () => LAYERS.find((l) => l.id === compareId) ?? null,
    [compareId],
  );

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setFrame((f) => (f + 1) % TOTAL_FRAMES);
    }, 900 / speed);
    return () => clearInterval(t);
  }, [playing, speed]);

  const pointSeed = region.id.length * 100 + frame + activeLayer.n * 3;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Верхняя строка статуса ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-[#0a1320]/90 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/15 glow-primary">
              <Icon name="Satellite" size={18} className="text-primary" />
            </div>
            <div>
              <div className="font-mono-data text-sm font-bold leading-none tracking-tight">
                МЕТЕО<span className="text-primary">·</span>ЦЕНТР РФ
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                оперативный мониторинг
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono-data text-xs text-accent">LIVE · ERA5</span>
          </div>

          <div className="ml-auto flex items-center gap-4 font-mono-data text-xs text-muted-foreground">
            <span className="hidden sm:inline">Обновлено {frameLabel(0)}</span>
            <span className="flex items-center gap-1.5 text-warning">
              <Icon name="TriangleAlert" size={14} />
              {ALERTS.length} предупреждений
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px]">
        {/* ── Левая панель: слои ── */}
        <aside className="border-b border-border lg:border-b-0 lg:border-r lg:min-h-[calc(100vh-53px)]">
          <div className="px-3 py-3">
            <div className="mb-2 px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              Слои карт · 6
            </div>
            <div className="space-y-1">
              {LAYERS.map((l) => {
                const active = l.id === activeLayer.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveLayer(l)}
                    className={`group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-all ${
                      active
                        ? 'bg-primary/12 glow-primary'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${
                        active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      <Icon name={l.icon} fallback="Cloud" size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`truncate text-[13px] font-medium ${active ? 'text-primary' : ''}`}>
                        {l.short}
                      </div>
                      <div className="truncate font-mono-data text-[10px] text-muted-foreground">
                        {l.unit} · {l.horizon}
                      </div>
                    </div>
                    <span className="font-mono-data text-[10px] text-muted-foreground">0{l.n}</span>
                  </button>
                );
              })}
            </div>

            {/* Сравнение */}
            <div className="mb-2 mt-5 px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              Сравнение (split)
            </div>
            <select
              value={compareId ?? ''}
              onChange={(e) => setCompareId(e.target.value || null)}
              className="w-full rounded-md border border-border bg-secondary px-2.5 py-2 font-mono-data text-xs outline-none focus:border-primary"
            >
              <option value="">— выключено —</option>
              {LAYERS.filter((l) => l.id !== activeLayer.id).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.short}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* ── Центр: карта + управление ── */}
        <main className="min-w-0 px-4 py-4">
          {/* Регионы */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRegion(r)}
                className={`rounded-md border px-3 py-1.5 font-mono-data text-xs transition-all ${
                  r.id === region.id
                    ? 'border-primary bg-primary/12 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {r.name}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 font-mono-data text-xs">
                <Icon name="Download" size={14} /> PNG
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 font-mono-data text-xs">
                <Icon name="FileDown" size={14} /> GeoTIFF
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 font-mono-data text-xs">
                <Icon name="Table" size={14} /> CSV
              </Button>
            </div>
          </div>

          {/* Заголовок карты */}
          <div className="mb-2 flex items-end justify-between">
            <div>
              <h1 className="text-lg font-bold leading-tight">
                {activeLayer.n}. {activeLayer.title}
              </h1>
              <p className="text-xs text-muted-foreground">{activeLayer.desc}</p>
            </div>
            <div className="text-right font-mono-data text-[11px] text-muted-foreground">
              <div className="text-primary">{activeLayer.source}</div>
              <div>{activeLayer.step} · прогноз {activeLayer.horizon}</div>
            </div>
          </div>

          {/* Карта(ы) */}
          <div className={`grid gap-3 ${compareLayer ? 'md:grid-cols-2' : ''}`}>
            <div>
              <WeatherMap layer={activeLayer} region={region} frame={frame} className="aspect-[16/10]" />
              <div className="mt-2 rounded-md border border-border bg-card px-3 py-2">
                <Legend layer={activeLayer} />
              </div>
            </div>
            {compareLayer && (
              <div>
                <WeatherMap layer={compareLayer} region={region} frame={frame} className="aspect-[16/10]" />
                <div className="mt-2 rounded-md border border-border bg-card px-3 py-2">
                  <div className="mb-1 text-[11px] font-medium text-primary">{compareLayer.title}</div>
                  <Legend layer={compareLayer} />
                </div>
              </div>
            )}
          </div>

          {/* Плеер анимации */}
          <div className="mt-3 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => setPlaying((p) => !p)}
              >
                <Icon name={playing ? 'Pause' : 'Play'} size={16} />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setFrame(0)}>
                <Icon name="SkipBack" size={15} />
              </Button>

              <div className="flex-1">
                <Slider
                  value={[frame]}
                  max={TOTAL_FRAMES - 1}
                  step={1}
                  onValueChange={(v) => setFrame(v[0])}
                />
              </div>

              <div className="w-24 shrink-0 text-right font-mono-data text-sm text-primary">
                {frameLabel(frame)}
              </div>

              <div className="flex shrink-0 items-center gap-1 rounded-md border border-border p-0.5">
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`rounded px-2 py-1 font-mono-data text-[11px] ${
                      speed === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    ×{s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2 flex justify-between font-mono-data text-[10px] text-muted-foreground">
              <span>+0 ч</span>
              <span>кадр {frame + 1} / {TOTAL_FRAMES}</span>
              <span>+{TOTAL_FRAMES - 1} ч</span>
            </div>
          </div>

          {/* Архив 10 дней */}
          <div className="mt-3 rounded-lg border border-border bg-card p-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <Icon name="Archive" size={13} /> Архив · до 10 прошлых суток
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 11 }).map((_, i) => {
                const day = i - 10;
                const d = new Date('2026-07-01T00:00:00');
                d.setDate(d.getDate() + day);
                const label = day === 0 ? 'сегодня' : `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
                return (
                  <button
                    key={i}
                    onClick={() => setArchiveDay(day)}
                    className={`rounded-md border px-2.5 py-1.5 font-mono-data text-[11px] transition-all ${
                      archiveDay === day
                        ? 'border-accent bg-accent/12 text-accent'
                        : 'border-border text-muted-foreground hover:border-accent/50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* ── Правая панель: аналитика + оповещения ── */}
        <aside className="border-t border-border lg:border-t-0 lg:border-l">
          {/* График точки */}
          <div className="border-b border-border p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Динамика в точке
              </span>
              <span className="font-mono-data text-[10px] text-primary">{region.center}</span>
            </div>
            <PointChart layer={activeLayer} seed={pointSeed} />
            <div className="mt-1 flex justify-between font-mono-data text-[10px] text-muted-foreground">
              <span>−24ч</span>
              <span>{activeLayer.unit}</span>
              <span>сейчас</span>
            </div>
          </div>

          {/* Текущие показатели */}
          <div className="border-b border-border p-3">
            <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              Показатели · {region.name}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LAYERS.slice(0, 4).map((l) => (
                <div key={l.id} className="rounded-md border border-border bg-secondary/40 p-2">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Icon name={l.icon} fallback="Cloud" size={11} /> {l.short}
                  </div>
                  <div className="font-mono-data text-sm font-bold text-primary">
                    {l.legend[Math.min(l.legend.length - 1, l.danger)].label}
                    <span className="ml-1 text-[10px] font-normal text-muted-foreground">{l.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Оповещения */}
          <div className="p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-warning">
              <Icon name="TriangleAlert" size={13} /> Опасные явления
            </div>
            <div className="space-y-2">
              {ALERTS.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-md border-l-2 bg-secondary/40 p-2.5 ${
                    a.level === 'danger' ? 'border-destructive' : 'border-warning'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium">{a.layer}</span>
                    <span
                      className={`flex items-center gap-1 font-mono-data text-[10px] ${
                        a.level === 'danger' ? 'text-destructive' : 'text-warning'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${a.level === 'danger' ? 'bg-destructive animate-pulse-alert' : 'bg-warning'}`} />
                      {a.region}
                    </span>
                  </div>
                  <div className="mt-0.5 font-mono-data text-sm font-bold text-foreground">{a.value}</div>
                  <div className="mt-0.5 flex justify-between text-[11px] text-muted-foreground">
                    <span>{a.place}</span>
                    <span className="font-mono-data">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Index;
