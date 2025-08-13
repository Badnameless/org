import { Injectable, signal } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CacheService } from '../../../../../libs/shared-template/src/lib/shared-template/shared/services/cache.service';
import { Tenant } from '../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/user';
import { DateOption } from '../shared/component/revenuestreamwidget/interfaces/DateOptions';
import { Metrics } from '../shared/interfaces/metrics';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  filterDataOptions: DateOption[] = [
    {
      label: 'Ultimos 7 días',
      division: 'week',
      value: 1
    },
    {
      label: 'Ultimo mes',
      division: 'month',
      value: 1
    },
    {
      label: 'Ultimos tres meses',
      division: 'month',
      value: 3
    },
    {
      label: 'Ultimo año',
      division: 'year',
      value: 1
    },
    {
      label: 'Personalizado',
      division: 'custom',
      dateFrom: undefined,
      dateTo: undefined,
    },
  ];

  metrics = signal<Metrics>({
    statMetrics: null,
    doughnutMetrics: [],
    barMetrics: []
  })

  private ttl: number = 1000 * 60 * 5;

  constructor(private httpService: HttpService, private http: HttpClient, private cache: CacheService) { }

  async getMetrics(tenantId: number, dateOption: DateOption) {
    const cacheKey = JSON.stringify(dateOption);
    const cached: Metrics = await this.cache.getCache(cacheKey, this.ttl)

    if (dateOption.division != 'custom' && cached) {
      this.metrics.set(cached);
    } else {
      const metricsResponse = await lastValueFrom(
        this.http.post<Metrics>(`${this.httpService.API_URL}/calculate_metrics/${tenantId}`,
          dateOption,
          { headers: this.httpService.header })
      )

      this.metrics.set(metricsResponse);
      dateOption.division != 'custom' ? await this.cache.setCache(cacheKey, metricsResponse) : cacheKey
    }
  }
}
