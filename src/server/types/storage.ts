export interface StorageAdapter<T = any> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  list(): Promise<string[]>;
}

export interface StorageOptions {
  basePath?: string;
  encoding?: BufferEncoding;
} 