import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useRealtime } from '@/hooks/useRealtime.agent';
import { useEdgeSync } from '@/hooks/useEdgeSync.agent';

export interface RealtimeChartDatum {
  label: string;
  value: number;
}

export interface RealtimeChartProps {
  channel: string;
  event: string;
  fallbackData?: RealtimeChartDatum[];
  initialFetcher?: () => Promise<RealtimeChartDatum[]>;
  title?: string;
  unit?: string;
}

export const RealtimeChart = ({
  channel,
  event,
  fallbackData = [],
  initialFetcher,
  title,
  unit,
}: RealtimeChartProps) => {
  const { data: edgeData } = useEdgeSync({
    key: `chart-${channel}-${event}`,
    fetcher: async () => (initialFetcher ? initialFetcher() : fallbackData),
    cache: new Map(),
    revalidateInterval: 60_000,
  });

  const realtimePayload = useRealtime<RealtimeChartDatum>({
    channel,
    event,
    enabled: true,
  });

  const dataset = useMemo(() => {
    const base = edgeData ?? fallbackData;
    if (realtimePayload) {
      const filtered = base.filter((item) => item.label !== realtimePayload.label);
      return [...filtered, realtimePayload].slice(-30);
    }
    return base;
  }, [edgeData, fallbackData, realtimePayload]);

  const TOOLTIP_CONTENT_STYLE = { backgroundColor: '#111827', borderRadius: '0.75rem', border: '1px solid #1f2937' } as const;
  const TOOLTIP_LABEL_STYLE = { color: '#cbd5f5' } as const;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl">
      {title && <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">{title}</h3>}
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <AreaChart data={dataset} margin={{ top: 10, right: 24, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="agentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis dataKey="label" stroke="#475569" tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}${unit ?? ''}`} />
            <Tooltip
              contentStyle={TOOLTIP_CONTENT_STYLE}
              labelStyle={TOOLTIP_LABEL_STYLE}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#agentGradient)"
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
