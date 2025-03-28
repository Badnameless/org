import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { Observable, tap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Plan } from '../interfaces/plan';

@Injectable({
  providedIn: 'root'
})
export class PlanService{

  constructor(private http: HttpClient, private httpService: HttpService) {}

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.httpService.API_URL}/get/plans`);
  }

  storePlan(form: FormGroup): Observable<FormGroup> {
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/create/plan`, form);
  }
}
