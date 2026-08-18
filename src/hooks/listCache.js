const store = new Map();

export const getListCache = (key) => store.get(key);
export const setListCache = (key, value) => store.set(key, value);
export const clearListCache = (keyPrefix) => {
  for (const key of store.keys()) {
    if (key.startsWith(keyPrefix)) store.delete(key);
  }
};