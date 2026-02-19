import { Loader2, Sparkles } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights.agent';

export interface AIInsightsCardProps {
  prompt: string;
  context?: Record<string, unknown>;
  auto?: boolean;
  className?: string;
}

export const AIInsightsCard = ({ prompt, context, auto = true, className }: AIInsightsCardProps) => {
  const { data, error, isLoading, refresh } = useAIInsights({ prompt, context, auto });

  return (
    <section
      className={`flex h-full flex-col justify-between rounded-2xl border border-violet-900/60 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-6 text-slate-100 shadow-[0_30px_120px_-30px_rgba(99,102,241,0.45)] ${className ?? ''}`.trim()}
    >
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-700/20 text-violet-300">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-violet-200">AI Insights</h2>
            <p className="text-xs text-slate-400">Análises preditivas alimentadas por OpenAI Assist</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => refresh()}
          className="rounded-full border border-violet-700/70 px-3 py-1 text-xs text-violet-200 transition hover:bg-violet-700/20"
        >
          Atualizar
        </button>
      </header>
      <div className="flex-1 space-y-3">
        {isLoading && (
          <p className="flex items-center gap-2 text-sm text-violet-200">
            <Loader2 className="h-4 w-4 animate-spin" /> Processando métricas em tempo real…
          </p>
        )}
        {error && !isLoading && (
          <p className="text-sm text-rose-300">Falha ao gerar insight: {error.message}</p>
        )}
        {data && !isLoading && (
          <>
            <h3 className="text-lg font-semibold text-white">{data.title}</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">{data.summary}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-violet-200">
              <span className="rounded-full bg-violet-800/30 px-3 py-1">
                Confiança: {(data.confidence * 100).toFixed(0)}%
              </span>
              {data.actions.map((action) => (
                <span key={action} className="rounded-full bg-slate-900/60 px-3 py-1 text-slate-300">
                  {action}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
