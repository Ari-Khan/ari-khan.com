import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const galleryDir = path.resolve(__dirname, '../public/images/gallery');
const outputFile = path.resolve(__dirname, '../public/images/gallery/manifest.json');

const files = fs.readdirSync(galleryDir);

const imageExt = /\.(webp|png|jpg|jpeg|gif|avif)$/i;
const videoExt = /\.(mp4|webm|ogg)$/i;

const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const images = files.filter(f => imageExt.test(f)).sort(naturalSort);
const videos = files.filter(f => videoExt.test(f)).sort(naturalSort);

const total = images.length + videos.length;
const ordered = [];
let imgIdx = 0;
let vidIdx = 0;

if (images.length === 0) {
  for (const v of videos) {
    ordered.push({ type: 'video', src: `/images/gallery/${v}` });
  }
} else if (videos.length === 0) {
  for (const img of images) {
    ordered.push({ type: 'image', src: `/images/gallery/${img}` });
  }
} else {
  const arc = total / videos.length;
  const positions = new Set();

  for (let k = 0; k < videos.length; k++) {
    positions.add(Math.round(arc * k + arc / 2));
  }

  for (let i = 0; i < total; i++) {
    if (positions.has(i)) {
      ordered.push({ type: 'video', src: `/images/gallery/${videos[vidIdx++]}` });
    } else {
      ordered.push({ type: 'image', src: `/images/gallery/${images[imgIdx++]}` });
    }
  }
}

fs.writeFileSync(outputFile, JSON.stringify(ordered, null, 2));
console.log(`Gallery manifest: ${images.length} images, ${videos.length} videos → ${ordered.length} items`);
