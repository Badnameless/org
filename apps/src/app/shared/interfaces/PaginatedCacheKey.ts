import { FilterMetadata } from "primeng/api";

export interface PaginatedCacheKey {
      type: string,
      page: number,
      perpage: number,
      filters: FilterMetadata[]
    }
