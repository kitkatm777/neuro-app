const Storage = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)) ?? null; }
    catch { return null; }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  getArray(key) {
    const val = this.get(key);
    return Array.isArray(val) ? val : [];
  },
  push(key, item) {
    const arr = this.getArray(key);
    arr.push(item);
    this.set(key, arr);
  },
  remove(key, id) {
    const arr = this.getArray(key).filter(i => i.id !== id);
    this.set(key, arr);
  },
  update(key, id, patch) {
    const arr = this.getArray(key).map(i => i.id === id ? { ...i, ...patch } : i);
    this.set(key, arr);
  },
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
};
