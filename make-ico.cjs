// Script simples para criar ICO a partir de PNG
// Usa o formato PNG embutido em ICO (suportado pelo Windows Vista+)

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'icon.png');
const outputPath = path.join(__dirname, 'public', 'icon.ico');

try {
    const pngData = fs.readFileSync(inputPath);

    // ICO Header (6 bytes)
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);     // Reserved (must be 0)
    header.writeUInt16LE(1, 2);     // Type (1 = ICO)
    header.writeUInt16LE(1, 4);     // Number of images = 1

    // ICO Directory Entry (16 bytes)
    const entry = Buffer.alloc(16);
    entry.writeUInt8(0, 0);         // Width (0 = 256)
    entry.writeUInt8(0, 1);         // Height (0 = 256)
    entry.writeUInt8(0, 2);         // Color palette (0 = no palette)
    entry.writeUInt8(0, 3);         // Reserved
    entry.writeUInt16LE(1, 4);      // Color planes
    entry.writeUInt16LE(32, 6);     // Bits per pixel
    entry.writeUInt32LE(pngData.length, 8);  // Size of image data
    entry.writeUInt32LE(22, 12);    // Offset to image data (6 + 16 = 22)

    // Combine header + entry + PNG data
    const icoBuffer = Buffer.concat([header, entry, pngData]);

    fs.writeFileSync(outputPath, icoBuffer);
    console.log('✅ icon.ico criado com sucesso!');
    console.log('   Tamanho:', icoBuffer.length, 'bytes');
    console.log('   Local:', outputPath);
} catch (error) {
    console.error('❌ Erro:', error.message);
}
