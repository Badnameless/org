import { TableLazyLoadEvent } from "primeng/table";

export interface OnExportEmit {
  type: string,
  event: TableLazyLoadEvent | null
}
