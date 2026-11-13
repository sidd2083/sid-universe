const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create a valid 256x256 PNG in pure Node.js
function create256Png() {
  const width = 256;
  const height = 256;
  
  // Each scanline: filter byte (0) + width * 4 (RGBA)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - 128;
      const dy = y - 128;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= 110) {
        // Gradient from cyan core to deep blue rim
        const ratio = dist / 110;
        rawData[pxOffset] = Math.floor(6 + (1 - ratio) * 50);     // Red
        rawData[pxOffset + 1] = Math.floor(182 * (1 - ratio * 0.4)); // Green
        rawData[pxOffset + 2] = 255;                              // Blue
        rawData[pxOffset + 3] = 255;                              // Alpha
      } else if (dist <= 124) {
        // Subtle outer glow
        const glow = 1 - (dist - 110) / 14;
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 240;
        rawData[pxOffset + 2] = 255;
        rawData[pxOffset + 3] = Math.floor(glow * 180);
      } else {
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG chunks
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);

    return Buffer.concat([len, typeAndData, crc]);
  }

  // CRC-32 implementation
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // RGBA color type
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const pngBytes = create256Png();

// Now package into Windows 256x256 ICO format (Vista+ PNG-in-ICO standard)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type 1 = icon
header.writeUInt16LE(1, 4); // 1 image

const dirEntry = Buffer.alloc(16);
dirEntry.writeUInt8(0, 0); // 0 = 256 width
dirEntry.writeUInt8(0, 1); // 0 = 256 height
dirEntry.writeUInt8(0, 2); // 0 colors in palette
dirEntry.writeUInt8(0, 3); // reserved
dirEntry.writeUInt16LE(1, 4); // color planes
dirEntry.writeUInt16LE(32, 6); // bpp
dirEntry.writeUInt32LE(pngBytes.length, 8); // image size
dirEntry.writeUInt32LE(22, 12); // offset = 6 + 16 = 22

const icoBuffer = Buffer.concat([header, dirEntry, pngBytes]);

const targetPath = path.join(__dirname, 'companion', 'resources', 'icon.ico');
fs.writeFileSync(targetPath, icoBuffer);
console.log('Valid 256x256 icon.ico created successfully at:', targetPath, 'Size:', icoBuffer.length, 'bytes');
