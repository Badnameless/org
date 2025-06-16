import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Token } from '../../auth/interfaces/token';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Tenant } from '../../auth/interfaces/user';
import { lastValueFrom, map } from 'rxjs';
import { Ncf } from '../interfaces/encf';
import { CacheService } from '../../../services/cache.service';
@Injectable({
  providedIn: 'root'
})
export class EncfService {

  constructor(private httpService: HttpService,
    private http: HttpClient,
    private cache: CacheService
  ) { }

  private ttl: number = 1000 * 60 * 10;

  get ncfTypes() {
    const tiposComprobante: Record<number, string> = {
      31: 'Factura de Crédito Fiscal',
      32: 'Factura de Consumo Electrónica',
      33: 'Nota de Débito Electrónica',
      34: 'Nota de Crédito Electrónica',
      41: 'Comprobante Electrónico de Compras',
      43: 'Comprobante Electrónico para Gastos Menores',
      44: 'Comprobante Electrónico para Regímenes Especiales',
      45: 'Comprobante Electrónico Gubernamental'
    };
    return tiposComprobante;
  }

  async getEncfs(): Promise<Ncf[]> {
    const cacheKey = 'api/encfs';
    const cached: Promise<Ncf[]> = await this.cache.getCache(cacheKey, this.ttl);

    if (cached) return cached;

    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const current_tenant: Tenant = JSON.parse(localStorage.getItem('current_tenant')!);
    const tenant_id: number = current_tenant.tenant_id;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const data = await lastValueFrom(this.http.get<Ncf[]>(`${this.httpService.API_URL}/get/encfs/${tenant_id}`, { headers }).pipe(
      map(encfs => encfs.map(encfs => ({
        ...encfs,
        transncf_fechaemision: new Date(encfs.transncf_fechaemision)
      })))
    ));

    this.cache.setCache(cacheKey, data);

    return data;
  }

  async getAllEncfs(): Promise<Ncf[]> {
    const cacheKey = 'api/encfs/all';
    const cached: Promise<Ncf[]> = await this.cache.getCache(cacheKey, this.ttl);

    if (cached) return cached;

    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const data = await lastValueFrom(this.http.get<Ncf[]>(`${this.httpService.API_URL}/get/encfs`, { headers }).pipe(
      map(encfs => encfs.map(encfs => ({
        ...encfs,
        transncf_fechaemision: new Date(encfs.transncf_fechaemision)
      })))
    ));

    this.cache.setCache(cacheKey, data);

    return data;
  }

  deleteEncfs(transncf_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    const params = new HttpParams().set('transncf_ids', transncf_ids.join(','));


    return this.http.delete<number[]>(`${this.httpService.API_URL}/delete/encfs`, { headers, params });
  }
}
