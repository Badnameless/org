import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Token } from '../../auth/interfaces/token';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Tenant } from '../../auth/interfaces/user';
import { Observable } from 'rxjs';
import { Ncf } from '../interfaces/encf';

@Injectable({
  providedIn: 'root'
})
export class EncfService {

  constructor(private httpService: HttpService, private http: HttpClient) { }

  getEncfs(): Observable<Ncf[]> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const current_tenant: Tenant = JSON.parse(localStorage.getItem('current_tenant')!);
    const tenant_id: number = current_tenant.tenant_id;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.get<Ncf[]>(`${this.httpService.API_URL}/get/encfs/${tenant_id}`, { headers });
  }

  deleteEncfs(transncf_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    const params = new HttpParams().set('transncf_ids', transncf_ids.join(','));


    return this.http.delete<number[]>(`${this.httpService.API_URL}/delete/encfs`, { headers, params });
  }

  getAllEncfs(): Observable<Ncf[]> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.get<Ncf[]>(`${this.httpService.API_URL}/get/encfs`, { headers });
  }
}
