import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFloatingConfigurator } from '../../../../../shared/component/app.floatingconfigurator';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorService } from '../../../../../services/validator.service';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../../../../admin/pages/users/services/user.service';
import { tap, lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-change-password',
  imports: [CommonModule, AppFloatingConfigurator, MessageModule, PasswordModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styles: ``
})
export class ChangePasswordComponent implements OnInit {

  public changePasswordFormGroup!: FormGroup;

  public isChanged: boolean = false;

  public user_email!: string | null;

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private route: ActivatedRoute,
    private userService:UserService,
    private router: Router
  ) {
    this.changePasswordFormGroup = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
      email: ['']
    },
      {
        validators: [
          validatorService.compareTwoFields('password', 'password_confirmation'),
        ]
      })
  }

  ngOnInit(){
    this.route.paramMap.pipe(
      tap(params => this.user_email = params.get('email')
    )).subscribe();

    this.changePasswordFormGroup.controls['email'].setValue(this.user_email);

  }


  isValidField(field: string): boolean | null {
    return this.validatorService.isValidField(this.changePasswordFormGroup, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.changePasswordFormGroup, field);
  }

  onSubmit() {
    this.changePasswordFormGroup.markAllAsTouched();
    if (this.changePasswordFormGroup.valid) {

      this.userService.changePassword(this.changePasswordFormGroup.value)
      .pipe(
        tap(res => console.log(res))
      ).subscribe()

      this.isChanged = true
      setTimeout(() => {
        this.isChanged = false;
        localStorage.clear();
        this.router.navigate(['auth/login']);
      }, 3000);
    }
  }

}
