import fs from 'fs/promises';
import path from 'path';
import { Storage, StorageOptions } from './types';

export class FileStorage<T> implements Storage<T> {
  private basePath: string;
  private encoding: BufferEncoding;

  constructor(namespace: string, options: StorageOptions = {}) {
    this.basePath = path.join(options.basePath || 'data', namespace);
    this.encoding = options.encoding || 'utf8';
    this.initialize();
  }

  private async initialize() {
    try {
      await fs.mkdir(this.basePath, { recursive: true });
    } catch (error) {
      console.error('Failed to initialize storage directory:', error);
      throw error;
    }
  }

  private getFilePath(key: string): string {
    return path.join(this.basePath, `${key}.json`);
  }

  async get(key: string): Promise<T | null> {
    try {
      const data = await fs.readFile(this.getFilePath(key), this.encoding);
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async set(key: string, value: T): Promise<void> {
    await fs.writeFile(
      this.getFilePath(key),
      JSON.stringify(value, null, 2),
      this.encoding
    );
  }

  async delete(key: string): Promise<void> {
    try {
      await fs.unlink(this.getFilePath(key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async list(): Promise<string[]> {
    const files = await fs.readdir(this.basePath);
    return files.map(file => path.parse(file).name);
  }

  async query(predicate: (item: T) => boolean): Promise<T[]> {
    const files = await this.list();
    const items: T[] = [];
    
    for (const key of files) {
      const item = await this.get(key);
      console.log('Querying item:', item);
      if (item && predicate(item)) {
        items.push(item);
      }
    }
    
    return items;
  }
} 