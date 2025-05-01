import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

export interface CachedItem {
  id: string;
  data: any;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService extends Dexie {

  cachedItems!: Table<CachedItem, string>;
  constructor() {
    super('CacheDatabase');

    this.version(1).stores({
      cachedItems: '&id, timestamp'
    });
  }

  async setCache(id: string, data: any): Promise<void>{
    await this.cachedItems.put({ id, data, timestamp: Date.now() });
  }

  async getCache(id: string, ttl: number): Promise<any | null> {
    const item = await this.cachedItems.get(id);
    if (item && (Date.now() - item.timestamp < ttl)) {
      return item.data;
    }
    return null;
  }

  async deleteCache(key: string){
    this.cachedItems.delete(key);
  }

}
