import { createContext, useContext } from 'react';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface WhatsAppStatusContextType {
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
    setIsConnected: (v: boolean) => void;
    setConnectionStatus: (status: ConnectionStatus) => void;
}

export const WhatsAppStatusContext = createContext<WhatsAppStatusContextType>({
    isConnected: false,
    connectionStatus: 'disconnected',
    setIsConnected: () => { },
    setConnectionStatus: () => { },
});

export const useWhatsAppStatus = () => useContext(WhatsAppStatusContext);
