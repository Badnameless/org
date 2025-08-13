import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { Observable, tap, lastValueFrom, switchMap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Plan } from '../interfaces/plan';
import { Token } from '../../../../../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/token';
import { CacheService } from '../../../../../../../../../libs/shared-template/src/lib/shared-template/shared/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private ttl: number = 1000 * 60 * 30;
  private cacheKey: string = 'api/plans/all';

  public plans = signal<Plan[]>([]);

  constructor(private http: HttpClient,
    private httpService: HttpService,
    private cache: CacheService
  ) {}

  async getPlans() {
    const cached: Promise<Plan[]> = await this.cache.getCache(this.cacheKey, this.ttl);

    if (cached) {
      this.plans.set(await cached);
    } else {
      const token: Token = JSON.parse(localStorage.getItem('token')!);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

      const data = await lastValueFrom(this.http.get<Plan[]>(`${this.httpService.API_URL}/get/plans`, { headers }));

      this.cache.setCache(this.cacheKey, data);

      this.plans.set(data);
    }
  }

  async storePlan(form: FormGroup) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const response = await lastValueFrom(this.http.post<Plan>(`${this.httpService.API_URL}/create/plan`, form));

    const cached: Plan[] = await this.cache.getCache(this.cacheKey, this.ttl)

    if (cached) {
      cached.push(await response)
      await this.cache.setCache(this.cacheKey, cached);
      this.plans.set(cached)
    } else {
      this.plans.update((currentValue) => [...currentValue, response])
    }
  }

  async updatePlan(form: FormGroup, id: number) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const response = await lastValueFrom(this.http.put<Plan>(`${this.httpService.API_URL}/update/plan`, form, { headers }));

    const cached: Plan[] = await this.cache.getCache(this.cacheKey, this.ttl)

    const updatedCache = cached.map(plan =>
      plan.plan_id === id ? response : plan
    )
    await this.cache.setCache(this.cacheKey, updatedCache);

    this.plans.set(updatedCache);
  }

  async deletePlans(plan_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    const params = new HttpParams().set('plan_ids', plan_ids.join(','));

    await lastValueFrom(this.http.delete<number[]>(`${this.httpService.API_URL}/delete/plans`, { headers, params }))

    const cached: Plan[] = await this.cache.getCache(this.cacheKey, this.ttl);

    const updated = cached.filter(plan => !plan_ids.includes(plan.plan_id))
    await this.cache.setCache(this.cacheKey, updated);

    this.plans.set(updated);
  }
}
