export interface DateOption {
  label: string,
  division: 'week' | 'month' | 'year' | 'custom',
  value?: number,
  dateFrom?: Date
  dateTo?: Date
}
