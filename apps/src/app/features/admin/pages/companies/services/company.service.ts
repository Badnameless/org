import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { FormGroup } from '@angular/forms';
import { lastValueFrom, Observable } from 'rxjs';
import { Company } from '../interfaces/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService{

  constructor(private http:HttpClient, private httpService:HttpService) {}

  getCompanies(): Observable<Company[]>{
    return this.http.get<Company[]>(`${this.httpService.API_URL}/get/companies`);
  }

  storeCompany(form: FormGroup): Observable<FormGroup>{
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/create/company`, form)
  }
}
