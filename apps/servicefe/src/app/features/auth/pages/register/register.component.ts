import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../shared/component/app.floatingconfigurator';
import { RegisterService } from './services/register.service';
import { ValidatorService } from '../../../../services/validator.service';
import { EmailValidatorService } from './validators/email-validator.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    RouterModule,
    RippleModule,
    AppFloatingConfigurator,
    CommonModule,
    MessageModule,
  ],
  templateUrl: './register.component.html',
  styles: ``
})
export class Register {

  public tenantFormGroup = new FormGroup({
    id: new FormControl('ABC'),
    name: new FormControl('tenantTest'),
    data: new FormGroup({
      numFacturas: new FormControl(1000),
      numClientes: new FormControl(100),
    }),
  });

  public registerFormGroup: FormGroup;

  constructor(
    private registerService: RegisterService,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private emailvalidator: EmailValidatorService,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50),
      Validators.pattern(validatorService.FullnamePattern)]],

      email: ['', [Validators.required, Validators.pattern(validatorService.emailPattern)], [this.emailvalidator]],

      password: ['', [Validators.required, Validators.minLength(6)]],

      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],

      tenantForm: [this.tenantFormGroup.value],
    },
      {
        validators: [
          validatorService.compareTwoFields('password', 'confirmPassword'),
        ]
      });
  }

  isValidField(field: string): boolean | null {
    return this.validatorService.isValidField(this.registerFormGroup, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.registerFormGroup, field);
  }

  onSubmit() {
    this.registerFormGroup.markAllAsTouched();
    if (this.registerFormGroup.valid) {
      this.registerService.registerUser(this.registerFormGroup.value).subscribe(res => {
        console.log(res);
      });

      const email = this.registerFormGroup.controls['email'].value;
      const password = this.registerFormGroup.controls['password'].value;
      this.authService.login(email, password).subscribe( res => {
        console.log(res)
      })

      setTimeout(() => {
        this.router.navigate(['auth/verify_notice'])
      }, 1000);
    }
  }
}
