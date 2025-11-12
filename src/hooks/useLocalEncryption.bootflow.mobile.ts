import { useCallback } from 'react';
import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

export const useLocalEncryption = () => {
  const generateKey = useCallback(async (): Promise<CryptoKey | null> => {
    try {
      const key = await crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
      );
      return key;
    } catch (error) {
      logger.error('Erro ao gerar chave de criptografia', { error: (error as Error).message });
      return null;
    }
  }, []);

  const encrypt = useCallback(async (data: string, key: CryptoKey): Promise<{ encrypted: string; iv: string } | null> => {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        key,
        dataBuffer,
      );

      return {
        encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        iv: btoa(String.fromCharCode(...iv)),
      };
    } catch (error) {
      logger.error('Erro ao criptografar', { error: (error as Error).message });
      return null;
    }
  }, []);

  const decrypt = useCallback(async (encrypted: string, iv: string, key: CryptoKey): Promise<string | null> => {
    try {
      const encryptedBuffer = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
      const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivBuffer,
        },
        key,
        encryptedBuffer,
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      logger.error('Erro ao descriptografar', { error: (error as Error).message });
      return null;
    }
  }, []);

  return {
    generateKey,
    encrypt,
    decrypt,
  };
};

