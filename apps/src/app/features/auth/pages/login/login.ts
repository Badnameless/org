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
import { lastValueFrom, of } from 'rxjs';
import { Token } from '../../interfaces/token';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Tenant, User } from '../../interfaces/user';
import { HttpErrorResponse } from '@angular/common/http';


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
export class Login {

  public loginFormGroup!: FormGroup;
  public email: string = '';
  public passsword: string = '';
  public token!: Token;
  public user!: User;
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private authService: AuthService,
    private router: Router,
    private message: MessageService
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

      try {
        this.isLoading = true;
        this.email = this.loginFormGroup.get('email')?.value;
        this.passsword = this.loginFormGroup.get('password')?.value;
        let defaultTenant!: Tenant;


        const token: Token = await lastValueFrom(this.authService.login(this.email, this.passsword));
        this.user = await lastValueFrom(this.authService.storeAuthUser(token));

        if (!localStorage.getItem('default_tenant')) {
          localStorage.setItem('default_tenant', JSON.stringify(this.user.tenants[0]))
          localStorage.setItem('current_tenant', JSON.stringify(this.user.tenants[0]))
        }else{
          defaultTenant = JSON.parse(localStorage.getItem('default_tenant')!);
        }

        if(this.user.user_id != defaultTenant.pivot.user_id){
          localStorage.setItem('default_tenant', JSON.stringify(this.user.tenants[0]))
          localStorage.setItem('current_tenant', JSON.stringify(this.user.tenants[0]))
        }

        this.router.navigate(['/']);

      } catch (error) {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.isLoading = false;
            this.message.add({ sticky: true, severity: 'error', summary: 'Error al iniciar sesión', detail: 'E-mail o contraseña invalidos' })
          }
        }else{
          this.isLoading = false;
          this.message.add({ sticky: true, severity: 'error', summary: 'Error inesperado', detail: 'Verifique con el administrador' })
        }
      }
    }
  }
}
