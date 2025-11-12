import { Skeleton } from '@/components/ui/skeleton';

export interface LoadingSkeletonProps {
  lines?: number;
  animate?: boolean;
  className?: string;
}

export const LoadingSkeleton = ({ lines = 3, animate = true, className }: LoadingSkeletonProps) => {
  return (
    <div className={`space-y-2 ${className ?? ''}`.trim()} role="status" aria-live="polite">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 w-full bg-slate-800 ${animate ? 'animate-pulse' : ''}`.trim()}
        />
      ))}
      <span className="sr-only">Carregando conteúdo…</span>
    </div>
  );
};
