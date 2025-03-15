import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { delay, Observable } from 'rxjs';
import { HttpService } from '../../../../../services/http.service';
import { EmailTakenResponse } from '../interfaces/email-taken-response';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService implements AsyncValidator{

  constructor(
    private http:HttpClient,
    private httpService:HttpService
  ){
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null>{
    const email = control.value;

    const httpEmailIsTaken = new Observable<ValidationErrors | null>( (subscriber) => {

    let response:EmailTakenResponse = {
      isTaken: false
    };

    this.http.get<EmailTakenResponse>(`${this.httpService.API_URL}/email/istaken`, { params: { email } }).subscribe( res => {
      response = res;

      if(response.isTaken){
        subscriber.next(response);
        subscriber.complete();
      }else{
        subscriber.next(null);
        subscriber.complete();
      }
    });
    }).pipe(delay(100));

    return httpEmailIsTaken;
  }

}
