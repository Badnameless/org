import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { FormGroup } from '@angular/forms';
import { lastValueFrom, Observable } from 'rxjs';
import { Company } from '../interfaces/company';
import { Token } from '../../../../auth/interfaces/token';
import { RnccedTakenResponse } from '../interfaces/rncced-taken-response';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.httpService.API_URL}/get/companies`);
  }

  storeCompany(form: FormGroup): Observable<FormGroup> {
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/create/company`, form)
  }

  updateCompany(form: FormGroup): Observable<RnccedTakenResponse> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.put<RnccedTakenResponse>(`${this.httpService.API_URL}/update/company`, form,{headers});
  }

  deleteCompanies(tenant_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    const params = new HttpParams().set('tenant_ids', tenant_ids.join(','));


    return this.http.delete<number[]>(`${this.httpService.API_URL}/delete/companies`, { headers, params });
  }
}
