import { FilterMetadata } from "primeng/api";

export interface Filter {
  filters: FilterMetadata[],
  name: string | undefined,
}
