import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { delay, Observable } from 'rxjs';
import { RnccedTakenResponse } from '../interfaces/rncced-taken-response';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../../../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class RnccedValidatorService implements AsyncValidator {

  constructor(private http:HttpClient, private httpService: HttpService) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null>{
    const rncced = control.value;

    const httpRnccedIsTaken = new Observable<ValidationErrors | null>( (subscriber) => {

    let response:RnccedTakenResponse = {
      rnccedIsTaken: false
    };

    this.http.get<RnccedTakenResponse>(`${this.httpService.API_URL}/rncced/istaken`, { params: { rncced } }).subscribe( res => {
      response = res;

      if(response.rnccedIsTaken){
        subscriber.next(response);
        subscriber.complete();
      }else{
        subscriber.next(null);
        subscriber.complete();
      }
    });
    }).pipe(delay(100));

    return httpRnccedIsTaken;
  }
}
