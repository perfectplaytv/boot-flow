import { Workbox } from 'workbox-window';

export const registerMobileServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/service-worker.bootflow.mobile.js', { type: 'module' });

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        console.log('[Service Worker] Nova versão disponível. Recarregue a página.');
      } else {
        console.log('[Service Worker] Instalado com sucesso.');
      }
    });

    wb.addEventListener('activated', () => {
      console.log('[Service Worker] Ativado.');
    });

    wb.addEventListener('waiting', () => {
      if (confirm('Nova versão disponível. Recarregar agora?')) {
        wb.messageSkipWaiting();
        window.location.reload();
      }
    });

    try {
      await wb.register();
      console.log('[Service Worker Mobile] Registrado com sucesso');
    } catch (error) {
      console.error('[Service Worker Mobile] Erro ao registrar:', error);
    }
  }
};

