const { app, BrowserWindow, Menu, shell, ipcMain, Tray, nativeImage } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let tray;

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 700,
        icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: true,
        },
        titleBarStyle: 'default',
        show: false,
        backgroundColor: '#0a0a0a',
    });


    // App URL - IMPORTANTE: Coloque aqui a URL do seu BootFlow hospedado
    const APP_URL = 'http://localhost:5173'; // Altere para a URL de produção quando fizer deploy

    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // Em produção, carrega a URL online em vez de arquivos locais
        // Isso permite que a aplicação se conecte ao backend
        mainWindow.loadURL(APP_URL);
    }

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Create menu
    createMenu();

    // Create tray icon
    createTray();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Minimize to tray instead of closing
    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
        return false;
    });
}

function createMenu() {
    const template = [
        {
            label: 'BootFlow',
            submenu: [
                { label: 'Sobre', role: 'about' },
                { type: 'separator' },
                { label: 'Configurações', accelerator: 'CmdOrCtrl+,', click: () => mainWindow.webContents.send('open-settings') },
                { type: 'separator' },
                { label: 'Sair', accelerator: 'CmdOrCtrl+Q', click: () => { app.isQuitting = true; app.quit(); } }
            ]
        },
        {
            label: 'Editar',
            submenu: [
                { label: 'Desfazer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                { label: 'Refazer', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
                { type: 'separator' },
                { label: 'Cortar', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: 'Copiar', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: 'Colar', accelerator: 'CmdOrCtrl+V', role: 'paste' },
                { label: 'Selecionar Tudo', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
            ]
        },
        {
            label: 'Visualização',
            submenu: [
                { label: 'Recarregar', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
                { label: 'Tela Cheia', accelerator: 'F11', click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
                { label: 'Zoom +', accelerator: 'CmdOrCtrl+=', role: 'zoomIn' },
                { label: 'Zoom -', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
                { label: 'Zoom Original', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
                { type: 'separator' },
                { label: 'DevTools', accelerator: 'F12', click: () => mainWindow.webContents.toggleDevTools() }
            ]
        },
        {
            label: 'Janela',
            submenu: [
                { label: 'Minimizar', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
                { label: 'Fechar', accelerator: 'CmdOrCtrl+W', role: 'close' }
            ]
        },
        {
            label: 'Ajuda',
            submenu: [
                { label: 'Documentação', click: () => shell.openExternal('https://bootflow.com.br/docs') },
                { label: 'Suporte', click: () => shell.openExternal('https://wa.me/5521999999999') }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function createTray() {
    const iconPath = path.join(__dirname, 'assets', 'icon.png');
    const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });

    tray = new Tray(trayIcon);
    tray.setToolTip('BootFlow - Sistema de Automação');

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Mostrar BootFlow', click: () => mainWindow.show() },
        { type: 'separator' },
        { label: 'Sair', click: () => { app.isQuitting = true; app.quit(); } }
    ]);

    tray.setContextMenu(contextMenu);
    tray.on('click', () => mainWindow.show());
}

// IPC Handlers
ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('get-platform', () => process.platform);

// App events
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    app.isQuitting = true;
});
