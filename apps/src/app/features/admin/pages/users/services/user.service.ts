import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Token } from '../../../../auth/interfaces/token';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient, private httpService: HttpService) { }

  storeUser(form: FormGroup): Observable<FormGroup>{
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/create/user`, form);
  }

  changePassword(form: FormGroup): Observable<HttpResponse<FormGroup>>{
    return this.http.post<HttpResponse<FormGroup>>(`${this.httpService.API_URL}/change/password`, form);
  }

  sendEmailRecoverPassword(email: string): Observable<HttpResponse<FormGroup>>{
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/RecoverPassword`, email, { observe: 'response' });
  }

  verifyResetToken(Signature: string, Expires: string, User: string): Observable<HttpResponse<[]>>{
    return this.http.post<any>(`${this.httpService.API_URL}/verify_reset_token`, { signature: Signature, expires: Expires, user: User}, { observe: 'response' })
  }
}
