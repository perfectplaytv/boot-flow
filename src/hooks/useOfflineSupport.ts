import { useState, useEffect } from 'react';
import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<Array<{ id: string; action: () => Promise<void> }>>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      logger.info('Conexão restaurada');
      processOfflineQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      logger.warn('Conexão perdida, modo offline ativado');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const processOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;

    logger.info(`Processando ${offlineQueue.length} ações da fila offline`);
    const queue = [...offlineQueue];
    setOfflineQueue([]);

    for (const item of queue) {
      try {
        await item.action();
        logger.info('Ação da fila offline executada', { id: item.id });
      } catch (error) {
        logger.error('Erro ao executar ação da fila offline', {
          id: item.id,
          error: (error as Error).message,
        });
        setOfflineQueue((prev) => [...prev, item]);
      }
    }
  };

  const addToOfflineQueue = (action: () => Promise<void>, id: string) => {
    setOfflineQueue((prev) => [...prev, { id, action }]);
    logger.info('Ação adicionada à fila offline', { id });
  };

  return {
    isOnline,
    offlineQueue: offlineQueue.length,
    addToOfflineQueue,
    processOfflineQueue,
  };
};

