import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../shared/component/app.floatingconfigurator';
import { ValidatorService } from '../../../../services/validator.service';
import { AuthService } from '../../services/auth.service';
import { delay } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [MessageModule,
              CommonModule,
              ButtonModule,
              CheckboxModule,
              InputTextModule,
              PasswordModule,
              ReactiveFormsModule,
              RouterModule,
              RippleModule,
              AppFloatingConfigurator],
    templateUrl: './login.html'
})
export class Login {

  public loginFormGroup!:FormGroup;
  public email: string = '';
  public passsword: string = '';

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private authService: AuthService,
    private router: Router
  ){
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  isValidField(field: string): boolean | null{
    return this.validatorService.isValidField(this.loginFormGroup, field);
  }

  getFieldError(field: string){
    return this.validatorService.getFieldError(this.loginFormGroup, field);
  }

  onSubmit(){
    this.loginFormGroup.markAllAsTouched();
    if(this.loginFormGroup.valid){

      this.email = this.loginFormGroup.get('email')?.value;
      this.passsword = this.loginFormGroup.get('password')?.value

      this.authService.login(this.email, this.passsword).subscribe(res => {
        console.log(res);
        this.router.navigate(['/']);
      });

    }
  }

}
