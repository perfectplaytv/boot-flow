import { useState, useEffect, useCallback } from 'react';
import { useDeviceDetect } from './useDeviceDetect.bootflow.mobile';
import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

export interface BiometricAuthOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useBiometricAuth = () => {
  const { isStandalone, isIOS, isAndroid } = useDeviceDetect();
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Verificar suporte a WebAuthn
    const checkSupport = async () => {
      const supported = 
        isStandalone && 
        'credentials' in navigator && 
        'PublicKeyCredential' in window;
      
      setIsSupported(supported);
      
      // Verificar se já está habilitado
      const enabled = localStorage.getItem('biometric-auth-enabled') === 'true';
      setIsEnabled(enabled);
    };

    checkSupport();
  }, [isStandalone]);

  const authenticate = useCallback(async (options: BiometricAuthOptions = {}): Promise<boolean> => {
    if (!isSupported) {
      const error = new Error('Biometria não suportada neste dispositivo');
      options.onError?.(error);
      return false;
    }

    try {
      // WebAuthn API
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [],
          userVerification: 'required',
        },
      } as any);

      if (credential) {
        options.onSuccess?.();
        logger.info('Autenticação biométrica bem-sucedida');
        return true;
      }

      return false;
    } catch (error) {
      const err = error as Error;
      logger.error('Erro na autenticação biométrica', { error: err.message });
      options.onError?.(err);
      return false;
    }
  }, [isSupported]);

  const enable = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    try {
      // Criar credencial biométrica
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: 'Boot Flow', id: window.location.hostname },
          user: {
            id: new Uint8Array(16),
            name: 'user@bootflow.com',
            displayName: 'Boot Flow User',
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            userVerification: 'required',
          },
        },
      } as any);

      if (credential) {
        localStorage.setItem('biometric-auth-enabled', 'true');
        setIsEnabled(true);
        logger.info('Biometria habilitada');
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Erro ao habilitar biometria', { error: (error as Error).message });
      return false;
    }
  }, [isSupported]);

  const disable = useCallback(() => {
    localStorage.removeItem('biometric-auth-enabled');
    setIsEnabled(false);
    logger.info('Biometria desabilitada');
  }, []);

  return {
    isSupported,
    isEnabled,
    authenticate,
    enable,
    disable,
  };
};

