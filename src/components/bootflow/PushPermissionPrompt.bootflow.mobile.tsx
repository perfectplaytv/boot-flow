import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, X } from 'lucide-react';
import { oneSignalService } from '@/lib/notifications/oneSignal.bootflow.mobile';
import { useAuth } from '@/contexts/AuthContext';

export const PushPermissionPrompt = () => {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Mostrar prompt se permissão for default e usuário estiver logado
      if (Notification.permission === 'default' && user && !localStorage.getItem('push-prompt-dismissed')) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }
  }, [user]);

  const handleRequestPermission = async () => {
    try {
      const newPermission = await oneSignalService.requestPermission();
      setPermission(newPermission);
      
      if (newPermission === 'granted' && user) {
        const userId = await oneSignalService.getUserId();
        if (userId) {
          await oneSignalService.registerDevice(user.id, userId);
        }
      }
      
      setShowPrompt(false);
      localStorage.setItem('push-prompt-dismissed', 'true');
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('push-prompt-dismissed', 'true');
  };

  if (!showPrompt || permission !== 'default') return null;

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-50 bg-slate-900 border-slate-800 shadow-2xl md:left-auto md:right-4 md:w-96">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-violet-400" />
            <CardTitle className="text-white">Notificações Push</CardTitle>
          </div>
          <button
            onClick={handleDismiss}
            className="rounded-lg p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <CardDescription className="text-slate-400">
          Receba notificações importantes sobre sua conta e atividades
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button onClick={handleRequestPermission} className="flex-1 bg-violet-600 hover:bg-violet-700">
          Ativar
        </Button>
        <Button onClick={handleDismiss} variant="outline" className="border-slate-700">
          Depois
        </Button>
      </CardContent>
    </Card>
  );
};

