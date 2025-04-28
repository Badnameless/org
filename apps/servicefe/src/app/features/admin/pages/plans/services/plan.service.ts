import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { Observable, tap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Plan } from '../interfaces/plan';
import { Token } from '../../../../auth/interfaces/token';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.httpService.API_URL}/get/plans`);
  }

  storePlan(form: FormGroup): Observable<FormGroup> {
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/create/plan`, form);
  }

  updatePlan(form: FormGroup): Observable<FormGroup> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.put<FormGroup>(`${this.httpService.API_URL}/update/plan`, form, { headers });
  }

  deletePlans(plan_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    const params = new HttpParams().set('plan_ids', plan_ids.join(','));

    return this.http.delete<number[]>(`${this.httpService.API_URL}/delete/plans`, { headers, params });
  }
}
