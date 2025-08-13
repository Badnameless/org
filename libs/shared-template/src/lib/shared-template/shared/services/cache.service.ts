import { Injectable, KeyValueDiffers } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { PaginatedCacheKey } from '../interfaces/PaginatedCacheKey';
import { Ncf } from '../../../../../../../apps/sakai-ng/src/app/features/encf/interfaces/encf';

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
  paginatedItems!: Table<CachedItem, string>;
  constructor() {
    super('CacheDatabase');

    this.version(1).stores({
      cachedItems: '&id, timestamp',
      paginatedItems: '&id, timestamp',
    });
  }

  async setCache(id: string, data: any): Promise<void> {
    await this.cachedItems.put({ id, data, timestamp: Date.now() });
  }

  async getCache(id: string, ttl: number): Promise<any | null> {
    const item = await this.cachedItems.get(id);
    if (item && (Date.now() - item.timestamp < ttl)) {
      return item.data;
    }
    return null;
  }

  async getCacheWithoutTtl(id: string): Promise<any | null> {
    const item = await this.cachedItems.get(id);
    return item!.data;
  }

  async deleteCache(key: string) {
    this.cachedItems.delete(key);
  }

  async deletePaginateCache(key: string) {
    this.paginatedItems.delete(key);
  }

  async setPaginateCache(id: string, data: Ncf, ttl: number): Promise<void> {
    const newKey = id;

    await this.transaction('readwrite', this.paginatedItems, async () => {
      this.paginatedItems.each(async (paginated) => {
        const oldKey = paginated.id
        if (newKey === oldKey) {
          await this.paginatedItems.delete(paginated.id)
        }
      })
    });

    this.deleteOldPaginateCache(ttl);

    await this.paginatedItems.put({
      id, data, timestamp: Date.now()
    });

    const parsedKey: PaginatedCacheKey = JSON.parse(newKey);
    if (parsedKey.perpage === 100 || parsedKey.perpage === 50) {
      this.deleteAllPaginatedCacheExcept(id)
    }
  }

  async getPaginateCache(id: string, ttl: number): Promise<any | null> {
    const item = await this.paginatedItems.get(id);
    if (item && (Date.now() - item.timestamp < ttl)) {
      return item.data;
    }
    return null;
  }

  async deleteAllPaginatedCacheExcept(idException: string) {
    await this.transaction('readwrite', this.paginatedItems, async () => {
      await this.paginatedItems.each(async (paginated) => {
        if (paginated.id != idException) {
          await this.paginatedItems.delete(paginated.id);
        }
      });
    });
  }

  async deleteOldPaginateCache(ttl: number) {
    await this.transaction('readwrite', this.paginatedItems, async () => {
      await this.paginatedItems.each(async (paginated) => {
        if (Date.now() - paginated.timestamp > ttl) {
          await this.paginatedItems.delete(paginated.id);
        }
      });
    });
  }
}
