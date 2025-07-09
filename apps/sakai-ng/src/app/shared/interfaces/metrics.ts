export interface Metrics {
  statMetrics:     StatMetrics | null;
  doughnutMetrics: DoughnutMetric[];
  barMetrics:      BarMetric[];
}

export interface BarMetric {
  tipoNcf_code: number;
  quantity:     number;
}

export interface DoughnutMetric {
  tipoNcf_code: number;
  tipoNcf_name: string;
  montototal:   number;
  itbistotal:   number;
  quantity:     number;
}

export interface StatMetrics {
  pending:    number;
  rejected:   number;
  accepted:   number;
  total:      number;
  totalItbis: number;
}
