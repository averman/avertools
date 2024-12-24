export interface StorageOptions {
  basePath?: string;
  encoding?: BufferEncoding;
}

export interface Storage<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  list(): Promise<string[]>;
  query(predicate: (item: T) => boolean): Promise<T[]>;
} 