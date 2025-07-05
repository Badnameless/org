import { Injectable, signal } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { HttpClient } from '@angular/common/http';
import { MonthStats } from '../interfaces/month-stats';
import { lastValueFrom } from 'rxjs';
import { CacheService } from '../../services/cache.service';
import { DoughnutStats } from '../interfaces/doughnut-stats';
import { Tenant } from '../../features/auth/interfaces/user';
import { BarStats } from '../interfaces/bar-stats';
import { DateOption } from '../component/revenuestreamwidget/interfaces/DateOptions';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  monthStats = signal<MonthStats>({
    rejected: 0,
    pending: 0,
    accepted: 0,
    total: 0,
    totalItbis: 0
  });

  doughnutStats = signal<DoughnutStats[]>([{
    tipoNcf_code: 0,
    tipoNcf_name: '',
    montototal: 0,
    itbistotal: 0,
    quantity: 0
  }])

  barStats = signal<BarStats[]>([{
    tipoNcf_code: 0,
    quantity: 0
  }])

  private ttl: number = 1000 * 60 * 5;

  constructor(private httpService: HttpService, private http: HttpClient, private cacheService: CacheService) { }

  get tenantId() {
    const currentTenant: Tenant = JSON.parse(localStorage.getItem('current_tenant')!);

    return currentTenant.tenant_id;
  }

  async getMonthStats(tenantId: number) {
    const cacheKey = 'api/calculateMetricsByMonth';
    const cached: MonthStats = await this.cacheService.getCache(cacheKey, this.ttl);

    if (cached) {

      this.monthStats.set(cached)

    } else {
      const monthStatsResponse = await lastValueFrom(this.http.get<MonthStats>(`${this.httpService.API_URL}/get_month_metrics/${tenantId}`, { headers: this.httpService.header }))
      await this.cacheService.setCache(cacheKey, monthStatsResponse);
      this.monthStats.set(monthStatsResponse);
    }
  }

  async calculateDoughnutStats(tenantId: number, dateRange?: Date[]) {
    const doughnutStatsResponse = await lastValueFrom(this.http.post<DoughnutStats[]>(`${this.httpService.API_URL}/calculate_doughnut_metrics/${tenantId}`, { date_from: dateRange?.[0], date_to: dateRange?.[1] }, { headers: this.httpService.header }))
    this.doughnutStats.set(doughnutStatsResponse);
  }

  async calculateBarStats(tenantId: number, selectedTime?: DateOption){
    const barStatsResponse = await lastValueFrom(this.http.post<BarStats[]>(`${this.httpService.API_URL}/calculate_bar_metrics/${tenantId}`, selectedTime, { headers: this.httpService.header }))
    this.barStats.set(barStatsResponse);
  }
}
