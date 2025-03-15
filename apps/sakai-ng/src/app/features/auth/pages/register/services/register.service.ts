import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../services/http.service';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Token } from '../../../interfaces/token';
import { resendResponse } from '../../verifyNotice/verify-notice/interfaces/ResendResponse';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient,
    private httpService: HttpService,
  ) { }

  public registerUser(form: FormGroup): Observable<FormGroup> {
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/register`, form);
  }

  public resendVerification(): Observable<resendResponse> {

    const token: Token = JSON.parse(localStorage.getItem('token')!)
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.post<resendResponse>(`${this.httpService.API_URL}/email/verification-notification`, {}, { headers })
  }
}
