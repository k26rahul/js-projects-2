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
