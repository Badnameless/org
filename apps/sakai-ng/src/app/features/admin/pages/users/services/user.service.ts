import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient, private httpService: HttpService) { }

  storeUser(form: FormGroup): Observable<FormGroup>{
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/create/user`, form);
  }

  changePassword(form: FormGroup): Observable<FormGroup>{
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/change/password`, form);
  }
}
