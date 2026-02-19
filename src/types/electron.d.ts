// Electron API types exposed via preload.js
interface ElectronAPI {
    getVersion: () => Promise<string>;
    getPlatform: () => Promise<string>;
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    onOpenSettings: (callback: () => void) => void;
    showNotification: (title: string, body: string) => void;
    isElectron: boolean;
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI;
    }
}

export { };
