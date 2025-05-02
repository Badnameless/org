import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { Observable, tap, lastValueFrom, switchMap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Plan } from '../interfaces/plan';
import { Token } from '../../../../auth/interfaces/token';
import { CacheService } from '../../../../../services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient,
    private httpService: HttpService,
    private cache: CacheService
  ) { }

  private ttl: number = 1000 * 60 * 30;
  private cacheKey: string = 'api/plans/all' ;

  async getPlans(): Promise<Plan[]> {
    const cached: Promise<Plan[]> = await this.cache.getCache(this.cacheKey, this.ttl);

    if (cached) return cached;

    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const data = await lastValueFrom(this.http.get<Plan[]>(`${this.httpService.API_URL}/get/plans`, { headers }));

    this.cache.setCache(this.cacheKey, data);

    return data;
  }

  storePlan(form: FormGroup): Observable<Plan> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.post<Plan>(`${this.httpService.API_URL}/create/plan`, form).pipe(
      switchMap(async (response) => {
        const cached: Plan[] = await this.cache.getCache(this.cacheKey, this.ttl)

        if(cached){
          cached.push(response)
          await this.cache.setCache(this.cacheKey, cached);
        }
        return response;
      })
    );
  }

  updatePlan(form: FormGroup, id: number): Observable<FormGroup> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.put<FormGroup>(`${this.httpService.API_URL}/update/plan`, form, { headers }).pipe(
      switchMap(async (response) => {
        const cached: Plan[] = await this.cache.getCache(this.cacheKey, this.ttl)

        if(cached){
          const updatedCache = cached.map(plan =>
            plan.plan_id === id ? response : plan
          )
          await this.cache.setCache(this.cacheKey, updatedCache);
        }

        return response;
      })
    );
  }

  deletePlans(plan_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    const params = new HttpParams().set('plan_ids', plan_ids.join(','));

    return this.http.delete<number[]>(`${this.httpService.API_URL}/delete/plans`, { headers, params }).pipe(
      switchMap(async (response) => {
        const cached: Plan[] = await this.cache.getCache(this.cacheKey, this.ttl);

        if(cached){
          const updated = cached.filter(plan => !plan_ids.includes(plan.plan_id))
          await this.cache.setCache(this.cacheKey, updated);
        }
        return response
      })
    );
  }
}
