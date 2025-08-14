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
import { AppFloatingConfigurator } from '../../../../../../../../libs/shared-template/src/lib/shared-template/shared/component/app.floatingconfigurator';
import { ValidatorService } from '../../../../../../../../libs/shared-template/src/lib/shared-template/shared/services/validator.service';
import { AuthService } from '../../../../../../../../libs/shared-template/src/lib/shared-template/shared/services/auth.service';
import { lastValueFrom } from 'rxjs';
import { Token } from '../../../../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/token';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Tenant, User } from '../../../../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/user';
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
  styleUrl: 'login.css',
  providers: [MessageService]
})
export class Login implements OnInit {

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

  async ngOnInit() {
    addEventListener('storage', (event) => {
      const changedStorage = event.key;

      if (changedStorage == 'user') {
        this.tryToLogin();
      }
    })
  }

  async tryToLogin() {
    try {
      const token: Token = JSON.parse(localStorage.getItem('token')!);
      const user = lastValueFrom(this.authService.storeAuthUser(token));

      if (await user) this.router.navigate(['loading']);

    } catch (error) { }
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

        localStorage.removeItem('current_tenant');

        const token: Token = await lastValueFrom(this.authService.login(this.email, this.passsword));
        this.user = await lastValueFrom(this.authService.storeAuthUser(token));

        const storedDefault = localStorage.getItem('default_tenant');
        const hasTenants = this.user?.tenants?.length > 0;

        if (!storedDefault && hasTenants) {
          const firstTenant = this.user.tenants[0];
          localStorage.setItem('default_tenant', JSON.stringify(firstTenant));
          localStorage.setItem('current_tenant', JSON.stringify(firstTenant));
        } else if (storedDefault) {
          const defaultTenant: Tenant = JSON.parse(storedDefault);

          if (hasTenants && this.user.user_id !== defaultTenant?.pivot?.user_id) {
            const firstTenant = this.user.tenants[0];
            localStorage.setItem('default_tenant', JSON.stringify(firstTenant));
            localStorage.setItem('current_tenant', JSON.stringify(firstTenant));
          } else {
            const currentTenant = localStorage.getItem('current_tenant');
            if (!currentTenant) {
              localStorage.setItem('current_tenant', storedDefault);
            }
          }
        }

        this.router.navigate(['loading']);

      } catch (error) {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.isLoading = false;
            this.message.add({ sticky: true, severity: 'error', summary: 'Error al iniciar sesión', detail: 'E-mail o contraseña invalidos' })
          }
        } else {
          this.isLoading = false;
          this.message.add({ sticky: true, severity: 'error', summary: 'Error inesperado', detail: 'Verifique con el administrador' })
        }
      }
    }
  }
}
