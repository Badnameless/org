import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageModule } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ValidatorService } from '../../../../services/validator.service';
import { UserService } from './services/user.service';
import { CompanyService } from '../companies/services/company.service';
import { Company } from '../companies/interfaces/company';
import { lastValueFrom } from 'rxjs';
import { EmailValidatorService } from './validators/email-validator.service';
import { EmailTakenResponse } from './interfaces/email-taken-response';
import { User } from '../../../auth/interfaces/user';

@Component({
  selector: 'app-add-user',
  imports: [MultiSelectModule, MessageModule, CommonModule, InputTextModule, FluidModule, ButtonModule, SelectModule, ReactiveFormsModule, TextareaModule],
  templateUrl: './UpdateAdduser.component.html',
})
export class UpdateAddUserComponent implements OnInit {

  @Output() onSuccess = new EventEmitter<void>();

  public companies!: Company[];

  public userFormGroup!: FormGroup;

  @Input()
  public user_name!: string;

  @Input()
  public user_email!: string;

  @Input()
  public user_id!: number;

  @Input()
  public tenants: number[] = [];

  public loading: boolean = true;

  public buttonText: string = '';

  constructor(private fb: FormBuilder,
    private validatorService: ValidatorService,
    private userService: UserService,
    private companyService: CompanyService,
    private emailValidator: EmailValidatorService
  ) {
    this.userFormGroup = this.fb.group({
      user_name: ['', [Validators.required, Validators.pattern(validatorService.FullnamePattern)]],
      user_email: ['', [Validators.required, Validators.pattern(validatorService.emailPattern)]],
      tenants: [[], [Validators.required]],
      user_id: ['']
    })
  }

  async ngOnInit() {
    this.userFormGroup.controls['user_name'].setValue(this.user_name)
    this.userFormGroup.controls['user_email'].setValue(this.user_email)
    this.userFormGroup.controls['user_id'].setValue(this.user_id)

    if (!this.user_name) {
      this.userFormGroup.controls['user_email'].setAsyncValidators(this.emailValidator.validate.bind(this.emailValidator));
    }

    try {
      this.companies = await this.companyService.getCompanies();
      this.loading = false;
      this.userFormGroup.controls['tenants'].setValue(this.tenants);
    } catch {
      console.log('Error al cargar data de las compañias');
    }

    this.buttonText = this.user_id ? 'Modificar' : 'Registrar'
  }

  isValidField(field: string): boolean | null {
    return this.validatorService.isValidField(this.userFormGroup, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.userFormGroup, field);
  }

  async onSubmit() {
    this.userFormGroup.markAllAsTouched();
    if (this.userFormGroup.valid) {

      if (this.user_name) {
        let response: EmailTakenResponse | User;
        response = await lastValueFrom(this.userService.updateUser(this.userFormGroup.value, this.user_id))

        if ('emailIsTaken' in  response) {
          this.userFormGroup.controls['tenants'].setErrors(await lastValueFrom(this.emailValidator.validate(this.userFormGroup.controls['tenants'])))
        } else {
          this.onSuccess.emit();
          window.location.reload();
        }

      }else{
        await lastValueFrom(this.userService.storeUser(this.userFormGroup.value))
        window.location.reload();
      }

    }
  }

}
