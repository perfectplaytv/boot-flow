const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // App info
    getVersion: () => ipcRenderer.invoke('get-app-version'),
    getPlatform: () => ipcRenderer.invoke('get-platform'),

    // Window controls
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),

    // Events from main process
    onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),

    // Notifications
    showNotification: (title, body) => {
        new Notification(title, { body });
    },

    // Check if running in Electron
    isElectron: true
});

// Add desktop app indicator to document
window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('electron-app');
});
