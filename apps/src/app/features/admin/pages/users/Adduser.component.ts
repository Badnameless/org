import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { lastValueFrom, tap } from 'rxjs';
import { EmailValidatorService } from './validators/email-validator.service';

@Component({
  selector: 'app-add-user',
  imports: [MultiSelectModule, MessageModule, CommonModule, InputTextModule, FluidModule, ButtonModule, SelectModule, ReactiveFormsModule, TextareaModule],
  templateUrl: './Adduser.component.html',
})
export class AddUserComponent implements OnInit {

  @Output() onSuccess = new EventEmitter<void>();

  public companies!: Company[];

  public userFormGroup!: FormGroup;

  constructor(private fb: FormBuilder,
    private validatorService: ValidatorService,
    private userService: UserService,
    private companyService: CompanyService,
    private emailValidator:EmailValidatorService
  ) {
    this.userFormGroup = this.fb.group({
      user_name: ['', [Validators.required, Validators.pattern(validatorService.FullnamePattern)]],
      user_email: ['', [Validators.required, Validators.pattern(validatorService.emailPattern)], [this.emailValidator]],
      tenant_names: ['', [Validators.required]]
    })
  }

  async ngOnInit() {
    try {
      this.companies = await lastValueFrom(this.companyService.getCompanies());
    } catch {
      console.log('Error al cargar data de las compañias');
    }
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

      const tenant_name: Company[] = this.userFormGroup.controls['tenant_names'].value
      const tenant_names: string[] = [];

      tenant_name.forEach(tenant_name => {
        tenant_names.push(tenant_name.tenant_name);
      })

      this.userFormGroup.controls['tenant_names'].setValue(tenant_names)

      await lastValueFrom(this.userService.storeUser(this.userFormGroup.value))

      this.userFormGroup.reset()
      this.onSuccess.emit();
      window.location.reload();
    }
  }

}
