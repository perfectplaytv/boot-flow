const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Caminhos
const publicDir = path.join(__dirname, 'public');
const assetsDir = path.join(__dirname, 'electron', 'assets');

// Garantir que diretório de destino existe
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Copiar ícones
console.log('📦 Copiando ícones para electron/assets...');
try {
    if (fs.existsSync(path.join(publicDir, 'icon.png'))) {
        fs.copyFileSync(path.join(publicDir, 'icon.png'), path.join(assetsDir, 'icon.png'));
        console.log('✅ icon.png copiado.');
    } else {
        console.warn('⚠️ icon.png não encontrado em public/');
    }

    if (fs.existsSync(path.join(publicDir, 'icon.ico'))) {
        fs.copyFileSync(path.join(publicDir, 'icon.ico'), path.join(assetsDir, 'icon.ico'));
        console.log('✅ icon.ico copiado.');
    } else {
        console.warn('⚠️ icon.ico não encontrado em public/');
    }
} catch (e) {
    console.error('❌ Erro ao copiar ícones:', e);
    process.exit(1);
}

// Executar build
console.log('🚀 Iniciando build do Electron para Windows...');
try {
    execSync('npm run electron:build:win', { stdio: 'inherit', cwd: __dirname });
    console.log('\n✅ Build concluído com sucesso!');
    console.log('📂 O arquivo .exe deve estar na pasta "release".');
} catch (error) {
    console.error('\n❌ Erro durante o build:', error.message);
    process.exit(1);
}
