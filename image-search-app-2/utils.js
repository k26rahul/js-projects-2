import { decodeBlurHash } from 'https://unpkg.com/fast-blurhash@1.1.4/index.js';

export function setBlurhashBg(blurhash, wrapper, width = 64, height = 64) {
  // decode blurHash image
  const pixels = decodeBlurHash(blurhash, width, height);

  // draw it on canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  canvas.toBlob(blob => {
    wrapper.style.backgroundImage = `url('${URL.createObjectURL(blob)}')`;
  });
}

export function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.slice(1);
  const r = parseInt(hexcolor.slice(0, 2), 16);
  const g = parseInt(hexcolor.slice(2, 4), 16);
  const b = parseInt(hexcolor.slice(4, 6), 16);

  // YIQ luma (brightness) formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq; // brightness score between 0 (dark) and 255 (bright)
}

export class Cache {
  constructor(storageId) {
    this.storageId = storageId; // string
    this.storage = JSON.parse(localStorage.getItem(storageId)) ?? {};
  }

  get(key) {
    return this.storage[key];
  }

  set(key, val) {
    this.storage[key] = val;
    localStorage.setItem(this.storageId, JSON.stringify(this.storage));
  }

  has(key) {
    return this.storage[key] != undefined;
  }
}
