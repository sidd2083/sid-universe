const fs = require('fs');
const path = require('path');

const resDir = path.join(__dirname, 'companion', 'resources');
if (!fs.existsSync(resDir)) {
  fs.mkdirSync(resDir, { recursive: true });
}

// Generate a valid 16x16 32-bit RGBA .ico file
const width = 16;
const height = 16;
const bpp = 32;
const biSizeImage = width * height * 4;
const maskSize = Math.ceil(width / 32) * 4 * height;
const bmpHeaderSize = 40;
const imageDataSize = bmpHeaderSize + biSizeImage + maskSize;
const fileHeaderSize = 6;
const dirEntrySize = 16;
const totalFileSize = fileHeaderSize + dirEntrySize + imageDataSize;

const buffer = Buffer.alloc(totalFileSize);

// ICONDIR (6 bytes)
buffer.writeUInt16LE(0, 0); // reserved
buffer.writeUInt16LE(1, 2); // type 1 = icon
buffer.writeUInt16LE(1, 4); // 1 image

// ICONDIRENTRY (16 bytes)
buffer.writeUInt8(width, 6);
buffer.writeUInt8(height, 7);
buffer.writeUInt8(0, 8); // 0 colors in palette
buffer.writeUInt8(0, 9); // reserved
buffer.writeUInt16LE(1, 10); // color planes
buffer.writeUInt16LE(bpp, 12); // bits per pixel
buffer.writeUInt32LE(imageDataSize, 14); // image size
buffer.writeUInt32LE(fileHeaderSize + dirEntrySize, 18); // offset to image

// BITMAPINFOHEADER (40 bytes)
let offset = 22;
buffer.writeUInt32LE(40, offset); // biSize
buffer.writeInt32LE(width, offset + 4); // biWidth
buffer.writeInt32LE(height * 2, offset + 8); // biHeight (doubled for mask in ICO)
buffer.writeUInt16LE(1, offset + 12); // biPlanes
buffer.writeUInt16LE(bpp, offset + 14); // biBitCount
buffer.writeUInt32LE(0, offset + 16); // biCompression = BI_RGB
buffer.writeUInt32LE(biSizeImage, offset + 20); // biSizeImage
buffer.writeInt32LE(0, offset + 24); // biXPelsPerMeter
buffer.writeInt32LE(0, offset + 28); // biYPelsPerMeter
buffer.writeUInt32LE(0, offset + 32); // biClrUsed
buffer.writeUInt32LE(0, offset + 36); // biClrImportant

// Pixel data: Cosmic Cyan glowing dot
offset += 40;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const dx = x - 7.5;
    const dy = y - 7.5;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const pixelOffset = offset + (y * width + x) * 4;

    if (dist <= 6) {
      buffer.writeUInt8(255, pixelOffset); // Blue
      buffer.writeUInt8(200, pixelOffset + 1); // Green
      buffer.writeUInt8(0, pixelOffset + 2); // Red
      buffer.writeUInt8(255, pixelOffset + 3); // Alpha
    } else {
      buffer.writeUInt8(0, pixelOffset);
      buffer.writeUInt8(0, pixelOffset + 1);
      buffer.writeUInt8(0, pixelOffset + 2);
      buffer.writeUInt8(0, pixelOffset + 3);
    }
  }
}

// AND mask (all zeros for transparent transparency handled by 32bpp alpha)
// Already 0 filled by Buffer.alloc

fs.writeFileSync(path.join(resDir, 'icon.ico'), buffer);
console.log('Valid icon.ico generated successfully at:', path.join(resDir, 'icon.ico'));
