// Script para converter PNG para ICO usando sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToIco() {
    const inputPath = path.join(__dirname, 'public', 'icon.png');
    const outputPath = path.join(__dirname, 'public', 'icon.ico');

    try {
        // Lê a imagem PNG
        const image = sharp(inputPath);

        // Cria múltiplos tamanhos necessários para ICO
        const sizes = [16, 32, 48, 64, 128, 256];
        const buffers = [];

        for (const size of sizes) {
            const buffer = await image
                .clone()
                .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
                .png()
                .toBuffer();
            buffers.push({ size, buffer });
        }

        // Para ICO simples, vamos usar o PNG de 256x256 como base
        // O electron-builder deve aceitar isso
        const ico256 = await image
            .resize(256, 256, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toBuffer();

        // Criar header ICO manualmente
        const iconDir = createIcoFile(buffers);
        fs.writeFileSync(outputPath, iconDir);

        console.log('✅ Ícone ICO criado com sucesso em:', outputPath);
    } catch (error) {
        console.error('❌ Erro ao converter:', error.message);
    }
}

function createIcoFile(images) {
    // ICO file structure:
    // - Header (6 bytes)
    // - Image entries (16 bytes each)
    // - Image data

    const headerSize = 6;
    const entrySize = 16;
    const numImages = images.length;

    // Calculate offsets
    let dataOffset = headerSize + (entrySize * numImages);
    const entries = [];
    const imageDataParts = [];

    for (const { size, buffer } of images) {
        entries.push({
            width: size === 256 ? 0 : size, // 0 means 256
            height: size === 256 ? 0 : size,
            colors: 0,
            reserved: 0,
            planes: 1,
            bitsPerPixel: 32,
            dataSize: buffer.length,
            dataOffset
        });
        imageDataParts.push(buffer);
        dataOffset += buffer.length;
    }

    // Create header
    const header = Buffer.alloc(headerSize);
    header.writeUInt16LE(0, 0);      // Reserved
    header.writeUInt16LE(1, 2);      // Type (1 = ICO)
    header.writeUInt16LE(numImages, 4); // Number of images

    // Create entries
    const entriesBuffer = Buffer.alloc(entrySize * numImages);
    entries.forEach((entry, i) => {
        const offset = i * entrySize;
        entriesBuffer.writeUInt8(entry.width, offset);
        entriesBuffer.writeUInt8(entry.height, offset + 1);
        entriesBuffer.writeUInt8(entry.colors, offset + 2);
        entriesBuffer.writeUInt8(entry.reserved, offset + 3);
        entriesBuffer.writeUInt16LE(entry.planes, offset + 4);
        entriesBuffer.writeUInt16LE(entry.bitsPerPixel, offset + 6);
        entriesBuffer.writeUInt32LE(entry.dataSize, offset + 8);
        entriesBuffer.writeUInt32LE(entry.dataOffset, offset + 12);
    });

    // Combine all parts
    return Buffer.concat([header, entriesBuffer, ...imageDataParts]);
}

convertToIco();
