import { Component } from '@angular/core';
import { AppFloatingConfigurator } from '../../../../../../../../libs/shared-template/src/lib/shared-template/shared/component/app.floatingconfigurator';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ValidatorService } from '../../../../../../../../libs/shared-template/src/lib/shared-template/shared/services/validator.service';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../../admin/pages/users/services/user.service';
import { lastValueFrom } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse} from '@angular/common/http';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router } from '@angular/router';
import { User } from '../../../../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/user';

@Component({
  selector: 'app-forgot-password',
  imports: [AppFloatingConfigurator, CommonModule, ReactiveFormsModule, ButtonModule, MessageModule, InputTextModule, ToastModule, FloatLabelModule],
  templateUrl: './forgot-password.component.html',
  styles: ``,
  providers: [MessageService]
})
export class ForgotPasswordComponent {

  public forgotPasswordFormGroup!: FormGroup;
  public isLoading: boolean = false;
  public success: boolean = false;

  constructor(private validatorService: ValidatorService,
              private fb: FormBuilder,
              private userService: UserService,
              private message: MessageService,
              private router: Router,
            ) {
    this.forgotPasswordFormGroup = fb.group({
      recover_email: ['', [Validators.required, Validators.pattern(validatorService.emailPattern)]]
    })
  }

  isValidField(field: string): boolean | null {
    return this.validatorService.isValidField(this.forgotPasswordFormGroup, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.forgotPasswordFormGroup, field);
  }

  async onSubmit() {
    this.forgotPasswordFormGroup.markAllAsTouched();
    if (this.forgotPasswordFormGroup.valid) {

      try {
        this.isLoading = true;
        await lastValueFrom(this.userService.sendEmailRecoverPassword(this.forgotPasswordFormGroup.value));
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['auth/login'])
        }, 5000);

      } catch (error) {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 404) {
            this.message.add({
              sticky: true,
              severity: 'error',
              summary: 'Error al buscar el E-mail',
              detail: 'No existe ningun usuario con el E-mail proporcionado.'
            })
            this.isLoading = false;
          }
        } else {
          this.message.add({
            sticky: true,
            severity: 'error',
            summary: 'Error',
            detail: `${error}`
          })
        }
      }

    }
  }
}
