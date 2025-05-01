import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { FormGroup } from '@angular/forms';
import { lastValueFrom, Observable, switchMap } from 'rxjs';
import { Company } from '../interfaces/company';
import { Token } from '../../../../auth/interfaces/token';
import { RnccedTakenResponse } from '../interfaces/rncced-taken-response';
import { CacheService } from '../../../../../services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient,
    private httpService: HttpService,
    private cache: CacheService
  ) { }

  private ttl: number = 1000 * 60 * 30;
  private cacheKey: string = 'api/companies/all';

  async getCompanies(): Promise<Company[]> {
    const cached: Promise<Company[]> = await this.cache.getCache(this.cacheKey, this.ttl);

    if (cached) return cached;

    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const data = await lastValueFrom(this.http.get<Company[]>(`${this.httpService.API_URL}/get/companies`, { headers }));

    this.cache.setCache(this.cacheKey, data);

    return data;
  }

  storeCompany(form: FormGroup): Observable<Company> {
    return this.http.post<Company>(`${this.httpService.API_URL}/create/company`, form).pipe(
      switchMap(async (response) => {
        const cached: Company[] = await this.cache.getCache(this.cacheKey, this.ttl);

        if (cached) {
          cached.push(response)
          this.cache.setCache(this.cacheKey, cached);
        }
        return response;
      })
    )
  }

  updateCompany(form: FormGroup, id: number): Observable<RnccedTakenResponse | Company> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.put<RnccedTakenResponse | Company>(`${this.httpService.API_URL}/update/company`, form, { headers }).pipe(
      switchMap(async (response) => {
        const cached: Company[] = await this.cache.getCache(this.cacheKey, this.ttl);

        if(cached){
          const updatedCache = cached.map(company =>
            company.tenant_id === id ? response : company
          )
          await this.cache.setCache(this.cacheKey, updatedCache);
        }

        return response;
      })
    );
  }

  deleteCompanies(tenant_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    const params = new HttpParams().set('tenant_ids', tenant_ids.join(','));

    console.log(tenant_ids)

    return this.http.delete<number[]>(`${this.httpService.API_URL}/delete/companies`, { headers, params }).pipe(
      switchMap(async () => {
        const cached: Company[] = await this.cache.getCache(this.cacheKey, this.ttl);
        if (cached) {
          const updated = cached.filter(company => !tenant_ids.includes(company.tenant_id));
          await this.cache.setCache(this.cacheKey, updated);
        }
      })
    )
  }
}
