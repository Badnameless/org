import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ValidatorService } from '../../../../services/validator.service';
import { PlanService } from '../plans/services/plan.service';
import { Plan } from '../plans/interfaces/plan';
import { lastValueFrom } from 'rxjs';
import { CompanyService } from './services/company.service';
import { RnccedValidatorService } from './validators/rncced-validator.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RnccedTakenResponse } from './interfaces/rncced-taken-response';
import { Company } from './interfaces/company';

@Component({
  selector: 'app-add-company',
  imports: [MessageModule, CommonModule, InputTextModule, FluidModule, ButtonModule, SelectModule, ReactiveFormsModule, TextareaModule],
  templateUrl: './UpdateAddcompany.component.html',
})
export class UpdateAddCompanyComponent implements OnInit {

  @Output() onSuccess = new EventEmitter<void>();

  public plans: Plan[] = [];
  public companyFormGroup!: FormGroup;
  public loading: boolean = true;

  @Input()
  public tenant_name!: string;

  @Input()
  public tenant_cedrnc!: string;

  @Input()
  public plan_name!: string;

  @Input()
  public tenant_id!: number;

  @Input()
  public plan_id!: number;

  public buttonText: string = '';

  constructor(private fb: FormBuilder,
    private validatorService: ValidatorService,
    private planService: PlanService,
    private companyService: CompanyService,
    private rnccedValidator: RnccedValidatorService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {
    this.companyFormGroup = this.fb.group({
      tenant_name: ['', [Validators.required]],
      tenant_cedrnc: ['', [Validators.required, Validators.pattern(validatorService.cedrncPattern)]],
      plan: [this.plan_name, [Validators.required]],
      tenant_id: [''],
      plan_id: ['']
    })
  }

  async ngOnInit() {
    this.companyFormGroup.controls['tenant_name'].setValue(this.tenant_name)
    this.companyFormGroup.controls['tenant_cedrnc'].setValue(this.tenant_cedrnc)
    this.companyFormGroup.controls['tenant_id'].setValue(this.tenant_id)
    this.companyFormGroup.controls['plan_id'].setValue(this.plan_id)

    if (!this.tenant_name) {
      this.companyFormGroup.controls['tenant_cedrnc'].setAsyncValidators(this.rnccedValidator.validate.bind(this.rnccedValidator));
    }

    try {
      this.plans = await this.planService.getPlans();
      this.loading = false;

      const selectedPlan = this.plans.find(p => p.plan_id === this.plan_id);
      this.companyFormGroup.controls['plan'].setValue(selectedPlan?.plan_id)

    } catch {
      console.log('Error al cargar data de los planes')
    }

    this.buttonText = this.tenant_id ? 'Modificar' : 'Agregar'
  }

  isValidField(field: string): boolean | null {
    return this.validatorService.isValidField(this.companyFormGroup, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.companyFormGroup, field);
  }

  async onSubmit() {
    this.companyFormGroup.markAllAsTouched();

    if (this.companyFormGroup.valid) {
      if (this.tenant_name) {

        let response: RnccedTakenResponse | Company;
        response = await lastValueFrom(this.companyService.updateCompany(this.companyFormGroup.value, this.tenant_id))

        if ('rnccedIsTaken' in response) {
          this.companyFormGroup.controls['tenant_cedrnc'].setErrors(await lastValueFrom(this.rnccedValidator.validate(this.companyFormGroup.controls['tenant_cedrnc'])))
        } else {
          this.onSuccess.emit();
          window.location.reload();
        }

      } else {
        await lastValueFrom(this.companyService.storeCompany(this.companyFormGroup.value))

        this.onSuccess.emit();
        window.location.reload();
      }
    }
  }
}


