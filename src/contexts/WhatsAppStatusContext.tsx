import React, { createContext, useContext } from 'react';

interface WhatsAppStatusContextType {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  setConnectionStatus: (status: 'disconnected' | 'connecting' | 'connected') => void;
}

export const WhatsAppStatusContext = createContext<WhatsAppStatusContextType | undefined>(undefined);

export const useWhatsAppStatus = () => {
  const context = useContext(WhatsAppStatusContext);
  if (context === undefined) {
    throw new Error('useWhatsAppStatus must be used within a WhatsAppStatusProvider');
  }
  return context;
};