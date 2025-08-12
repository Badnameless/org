import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFloatingConfigurator } from '../../../../../shared/component/app.floatingconfigurator';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorService } from '../../../../../services/validator.service';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../admin/pages/users/services/user.service';
import { tap, lastValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-change-password',
  imports: [
    CommonModule,
    AppFloatingConfigurator,
    MessageModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    ToastModule,
    TagModule
  ],
  templateUrl: './change-password.component.html',
  styles: ``,
  providers: [MessageService]
})
export class ChangePasswordComponent implements OnInit {

  public changePasswordFormGroup!: FormGroup;

  public isLoading: boolean = false;
  public success: boolean = false;

  public hasUpper: boolean = false;
  public hasLower: boolean = false;
  public hasNumber: boolean = false;
  public hasRequiredLength: boolean = false;

  public user_email!: string | null;
  public signature!: string | null;
  public expires!: string | null;
  public email!: string | null;

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private message:MessageService
  ) {
    this.changePasswordFormGroup = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(validatorService.passwordPattern)]],
      password_confirmation: ['', [Validators.required]],
      email: [''],
      signature: [''],
      expires: [''],
    },
      {
        validators: [
          validatorService.compareTwoFields('password', 'password_confirmation'),
        ]
      })
  }

  async ngOnInit() {
    this.route.paramMap.pipe(
      tap(async params => {
        this.signature = params.get('signature')
        this.expires = params.get('expires')
        this.email = params.get('email')

        try {
          await lastValueFrom(this.userService.verifyResetToken(this.signature!, this.expires!, this.email!))
        } catch (error) {
          this.router.navigate(['notfound']);
        }
      })).subscribe();

    this.changePasswordFormGroup.controls['email'].setValue(this.email);
    this.changePasswordFormGroup.controls['signature'].setValue(this.signature);
    this.changePasswordFormGroup.controls['expires'].setValue(this.expires);

  }

  passwordRequirements(){
    const psw: string = this.changePasswordFormGroup.controls['password'].value;

    this.hasLower = /[a-z]/.test(psw);
    this.hasUpper = /[A-Z]/.test(psw);
    this.hasNumber = /[0-9]/.test(psw);
    psw.length >= 8 ? this.hasRequiredLength = true : this.hasRequiredLength = false;
  }


  isValidField(field: string): boolean | null {
    return this.validatorService.isValidField(this.changePasswordFormGroup, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.changePasswordFormGroup, field);
  }

  async onSubmit() {
    this.changePasswordFormGroup.markAllAsTouched();
    if (this.changePasswordFormGroup.valid) {
      try {

        this.isLoading = true;
        this.userService.changePassword(this.changePasswordFormGroup.value).subscribe(res => {
          console.log(res)
        })
        this.success = true;
        setTimeout(() => {
          localStorage.clear();
          this.router.navigate(['auth/login']);
        }, 5000);

      } catch (error) {
        if (error instanceof HttpErrorResponse) {

          this.isLoading = false;

          if (error.status === 404) {
            this.message.add({
              sticky: true,
              severity: 'error',
              summary: 'Usuario no encontrado',
              detail: 'No se ha podido encontrar el usuario.'
            });
          }

          if(error.status === 403){
            this.message.add({
              sticky: true,
              severity: 'error',
              summary: 'Link expirado',
              detail: 'Este link ha expirado, solicite otro.'
            });
          }

        } else {

          this.isLoading = false;

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
