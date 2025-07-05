import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Token } from '../../auth/interfaces/token';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Tenant } from '../../auth/interfaces/user';
import { lastValueFrom, map, tap } from 'rxjs';
import { Ncf } from '../interfaces/encf';
import { CacheService } from '../../../services/cache.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { ExportEncfResponse } from '../interfaces/export-encf-response';
@Injectable({
  providedIn: 'root'
})
export class EncfService {

  constructor(private httpService: HttpService,
    private http: HttpClient,
    private cache: CacheService
  ) { }

  private ttl: number = 1000 * 60 * 1;

  async getEncfs(perPage: number, page: number, onLazyLoad?: TableLazyLoadEvent): Promise<Ncf> {
    const cacheKey = JSON.stringify({
      type: 'encf',
      page: page,
      perpage: perPage,
      filters: onLazyLoad?.filters
    });

    const cached: Promise<Ncf> = await this.cache.getPaginateCache(cacheKey, this.ttl);

    if (cached) return cached;

    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const current_tenant: Tenant = JSON.parse(localStorage.getItem('current_tenant')!);
    const tenant_id: number = current_tenant.tenant_id;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const data = await lastValueFrom(this.http.post<Ncf>(`${this.httpService.API_URL}/get/encfs/${tenant_id}/${perPage}?page=${page}`, onLazyLoad, { headers }));

    this.cache.setPaginateCache(cacheKey, data, this.ttl);

    return data;
  }

  async getAllEncfs(perPage: number, page: number, onLazyLoad?: TableLazyLoadEvent): Promise<Ncf> {
    const cacheKey = JSON.stringify({
      type: 'allEncf',
      page: page,
      perpage: perPage,
      filters: onLazyLoad?.filters
    });

    const cached: Promise<Ncf> = await this.cache.getPaginateCache(cacheKey, this.ttl);

    if (cached) return cached;

    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const data = await lastValueFrom(this.http.post<Ncf>(`${this.httpService.API_URL}/get/all_encfs/${perPage}?page=${page}`, onLazyLoad, { headers }));

    this.cache.setPaginateCache(cacheKey, data, this.ttl);

    return data;
  }

  async getEncfExportData(tenantId: number, onLazyLoad?: TableLazyLoadEvent): Promise<ExportEncfResponse[]> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const data = await lastValueFrom(this.http.post<ExportEncfResponse[]>(`${this.httpService.API_URL}/encfs/export_data/${tenantId}`, onLazyLoad, { headers }));

    return data;
  }

  deleteEncfs(transncf_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    const params = new HttpParams().set('transncf_ids', transncf_ids.join(','));


    return this.http.delete<number[]>(`${this.httpService.API_URL}/delete/encfs`, { headers, params });
  }
}
