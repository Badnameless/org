import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Token } from '../../../../auth/interfaces/token';
import { User } from '../../../../auth/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.httpService.API_URL}/get/users`);
  }

  deleteUsers(user_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    const params = new HttpParams().set('user_ids', user_ids.join(','));


    return this.http.delete<number[]>(`${this.httpService.API_URL}/delete/users`, { headers, params });
  }

  storeUser(form: FormGroup): Observable<FormGroup> {
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/create/user`, form);
  }

  changePassword(form: FormGroup): Observable<HttpResponse<FormGroup>> {
    return this.http.post<HttpResponse<FormGroup>>(`${this.httpService.API_URL}/change/password`, form);
  }

  sendEmailRecoverPassword(email: string): Observable<HttpResponse<FormGroup>> {
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/RecoverPassword`, email, { observe: 'response' });
  }

  verifyResetToken(Signature: string, Expires: string, User: string): Observable<HttpResponse<[]>> {
    return this.http.post<any>(`${this.httpService.API_URL}/verify_reset_token`, { signature: Signature, expires: Expires, user: User }, { observe: 'response' })
  }
}
