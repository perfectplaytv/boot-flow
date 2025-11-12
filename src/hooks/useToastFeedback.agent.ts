import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface ToastFeedbackOptions {
  successDuration?: number;
  errorDuration?: number;
}

export const useToastFeedback = (options?: ToastFeedbackOptions) => {
  const { toast } = useToast();

  const showSuccess = useCallback(
    (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: 'default',
        duration: options?.successDuration ?? 4000,
      });
    },
    [options?.successDuration, toast],
  );

  const showError = useCallback(
    (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: 'destructive',
        duration: options?.errorDuration ?? 6000,
      });
    },
    [options?.errorDuration, toast],
  );

  const showInfo = useCallback(
    (title: string, description?: string) => {
      toast({
        title,
        description,
        duration: 3500,
      });
    },
    [toast],
  );

  return {
    showSuccess,
    showError,
    showInfo,
  };
};
