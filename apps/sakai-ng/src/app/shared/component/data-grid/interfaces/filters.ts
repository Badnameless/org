import { FilterMetadata } from "primeng/api";

export interface Filter {
  filters: FilterData[],
  name: string | undefined,
}

export interface FilterData {
    value?: any;
    matchMode?: string;
    operator?: string;
    type?: string
}
