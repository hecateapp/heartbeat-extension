import { ObservableMap } from "mobx";

export interface CacheValue<T> {
  get(): T;
  set(val: T): void;
}

class Cache<T> {
  private innerCache: ObservableMap<string, T>;

  constructor() {
    this.innerCache = new ObservableMap<string, T>();
  }

  public value(key: string): CacheValue<T> {
    return {
      get: (): T => {
        return this.innerCache.get(key);
      },
      set: (val: T) => {
        this.innerCache.set(key, val);
      }
    };
  }

  public observe(key: string, cb: (newValue: T) => void): () => void {
    return this.innerCache.observe(change => {
      if (change.type === "update" && change.name === key) {
        cb(change.newValue);
      }
    });
  }
}

export default Cache;