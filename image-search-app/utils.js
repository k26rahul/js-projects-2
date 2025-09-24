import { decodeBlurHash } from 'https://unpkg.com/fast-blurhash@1.1.4/index.js';

export function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace('#', '');
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#222' : '#fff';
}

export function createBlurhashBackground(blurHash, wrapper, width = 32, height = 32) {
  const pixels = decodeBlurHash(blurHash, width, height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    wrapper.style.backgroundImage = `url('${url}')`;
  });
}

export class Cache {
  constructor(storageId) {
    this.storageId = storageId;
    const stored = localStorage.getItem(storageId);
    this.data = stored ? JSON.parse(stored) : {};
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key);
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    localStorage.setItem(this.storageId, JSON.stringify(this.data));
  }
}

export function onInfiniteScroll(callback, offset = 300) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const viewport = window.innerHeight;
    const fullHeight = document.body.offsetHeight;
    if (scrollY + viewport > fullHeight - offset) {
      callback();
    }
  });
}
