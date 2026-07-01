import { MeteoLayer } from '@/data/meteo';

const Legend = ({ layer, compact = false }: { layer: MeteoLayer; compact?: boolean }) => {
  return (
    <div className="space-y-1.5">
      {!compact && (
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Легенда</span>
          <span className="font-mono-data text-[11px] text-primary">{layer.unit}</span>
        </div>
      )}
      <div className="flex overflow-hidden rounded">
        {layer.legend.map((s, i) => (
          <div
            key={i}
            className="relative flex-1"
            style={{ background: s.color, minWidth: 0 }}
          >
            <div className="h-2.5" />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {layer.legend.map((s, i) => (
          <span
            key={i}
            className="font-mono-data text-[9px] leading-none text-muted-foreground"
            style={{ flex: 1, textAlign: i === 0 ? 'left' : i === layer.legend.length - 1 ? 'right' : 'center' }}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Legend;
