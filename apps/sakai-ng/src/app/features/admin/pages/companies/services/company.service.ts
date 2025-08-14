import { Company } from './../interfaces/company';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { HttpService } from '../../../../../../../../../libs/shared-template/src/lib/shared-template/shared/services/http.service';
import { FormGroup } from '@angular/forms';
import { lastValueFrom, Observable, switchMap } from 'rxjs';
import { Token } from '../../../../../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/token';
import { RnccedTakenResponse } from '../interfaces/rncced-taken-response';
import { CacheService } from '../../../../../../../../../libs/shared-template/src/lib/shared-template/shared/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private ttl: number = 1000 * 60 * 30;
  private cacheKey: string = 'api/companies/all';
  companies = signal<Company[]>([])

  constructor(private http: HttpClient,
    private httpService: HttpService,
    private cache: CacheService
  ) {}

  async getCompanies() {
    const cached: Promise<Company[]> = await this.cache.getCache(this.cacheKey, this.ttl);

    if (cached) {
      this.companies.set(await cached)
    } else {
      const token: Token = JSON.parse(localStorage.getItem('token')!);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

      const data = await lastValueFrom(this.http.get<Company[]>(`${this.httpService.API_URL}/get/companies`, { headers }));

     await this.cache.setCache(this.cacheKey, data);

      this.companies.set(data);
    }
  }

  async storeCompany(form: FormGroup) {
    const response = await lastValueFrom(this.http.post<Company>(`${this.httpService.API_URL}/create/company`, form))

    const cached: Company[] = await this.cache.getCache(this.cacheKey, this.ttl);

    cached.push(response)
    this.cache.setCache(this.cacheKey, cached);

    this.companies.set(cached);
  }

  async updateCompany(form: FormGroup, id: number) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const response = await lastValueFrom(this.http.put<RnccedTakenResponse | Company>(`${this.httpService.API_URL}/update/company`, form, { headers }))

    if ('rnccedIsTaken' in response) {
      return response;
    } else {
      const cached: Company[] = await this.cache.getCache(this.cacheKey, this.ttl);

      const updatedCache = cached.map(company =>
        company.tenant_id === id ? response : company
      )
      await this.cache.setCache(this.cacheKey, updatedCache);
      this.companies.set(updatedCache)
      return updatedCache
    }
  }

  async deleteCompanies(tenant_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    const params = new HttpParams().set('tenant_ids', tenant_ids.join(','));

    await lastValueFrom(this.http.delete<number[]>(`${this.httpService.API_URL}/delete/companies`, { headers, params }));

    const cached: Company[] = await this.cache.getCache(this.cacheKey, this.ttl);

    const updated = cached.filter(company => !tenant_ids.includes(company.tenant_id));
    await this.cache.setCache(this.cacheKey, updated);

    this.companies.set(updated);
  }
}
