import { Component, OnInit } from '@angular/core';
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
import { Crud } from '../../../crud/crud';

@Component({
  selector: 'app-company',
  imports: [MessageModule, CommonModule, InputTextModule, FluidModule, ButtonModule, SelectModule, ReactiveFormsModule, TextareaModule, Crud],
  templateUrl: './company.component.html',
})
export class CompanyComponent implements OnInit {

  public plans: Plan[] = [];
  public plansNames: any[] = [];
  public companyFormGroup!: FormGroup;

  constructor(private fb: FormBuilder,
    private validatorService: ValidatorService,
    private planService: PlanService,
    private companyService: CompanyService,
    private rnccedValidator: RnccedValidatorService
  ) {
    this.companyFormGroup = this.fb.group({
      tenant_name: ['', [Validators.required]],
      tenant_cedrnc: ['', [Validators.required, Validators.pattern(validatorService.cedrncPattern)], [this.rnccedValidator]],
      plan_name: ['', [Validators.required]]
    })
  }

  async ngOnInit() {
    try {
      this.plans = await lastValueFrom(this.planService.getPlans());

      this.plansNames = this.plans.map(planDetail => ({
        label: planDetail.plan.plan_name,
      }));
    } catch {
      console.log('Error al cargar data de los planes')
    }
  }

  isValidField(field: string): boolean | null {
    return this.validatorService.isValidField(this.companyFormGroup, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.companyFormGroup, field);
  }

  onSubmit() {
    this.companyFormGroup.markAllAsTouched();
    if (this.companyFormGroup.valid) {

      const planValue = this.companyFormGroup.controls['plan_name'].value
      this.companyFormGroup.controls['plan_name'].setValue(planValue.label)

      this.companyService.storeCompany(this.companyFormGroup.value)
        .subscribe(res => {
          console.log(res)
        });
    }
  }

}
