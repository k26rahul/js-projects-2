export function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.slice(1);
  const r = hexcolor.slice(0, 2);
  const g = hexcolor.slice(2, 4);
  const b = hexcolor.slice(4, 6);
  console.log(r, g, b);
}

// export function getContrastYIQ(hexcolor) {
//   hexcolor = hexcolor.replace('#', '');
//   const r = parseInt(hexcolor.substr(0, 2), 16);
//   const g = parseInt(hexcolor.substr(2, 2), 16);
//   const b = parseInt(hexcolor.substr(4, 2), 16);

//   console.log(r, g, b);

//   const yiq = (r * 299 + g * 587 + b * 114) / 1000;
//   return yiq >= 128 ? '#222' : '#fff';
// }

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
