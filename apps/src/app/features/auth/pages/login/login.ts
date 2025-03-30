import { Component } from '@angular/core';
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
import { catchError, lastValueFrom, of } from 'rxjs';
import { Token } from '../../interfaces/token';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MessageModule,
    ToastModule,
    CommonModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    RouterModule,
    RippleModule,
    AppFloatingConfigurator],
  templateUrl: './login.html',
  providers: [MessageService]
})
export class Login{

  public loginFormGroup!: FormGroup;
  public email: string = '';
  public passsword: string = '';
  public token!: Token;

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private authService: AuthService,
    private router: Router,
    private message:MessageService
  ) {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  isValidField(field: string): boolean | null {
    return this.validatorService.isValidField(this.loginFormGroup, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.loginFormGroup, field);
  }

  async onSubmit() {
    this.loginFormGroup.markAllAsTouched();
    if (this.loginFormGroup.valid) {

      this.email = this.loginFormGroup.get('email')?.value;
      this.passsword = this.loginFormGroup.get('password')?.value
      let errorStatus: number = 0;

      const token: Token = await lastValueFrom(this.authService.login(this.email, this.passsword)
        .pipe(
          catchError(error => {
            errorStatus = error.status;
            this.message.add({ severity: 'error', summary: 'Error', detail: 'Usuario o contraseña invalidos.' });
            return of()
          })
        ))

      await lastValueFrom(this.authService.storeAuthUser(token));

      if(token && errorStatus === 0) this.router.navigate(['/']);

    }
  }
}
