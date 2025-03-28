import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { Component } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ValidatorService } from '../../../../services/validator.service';
import { PlanService } from './services/plan.service';

@Component({
  selector: 'app-plan',
  imports: [MessageModule, CommonModule, ReactiveFormsModule, InputTextModule, FluidModule, ButtonModule, SelectModule, TextareaModule],
  templateUrl: './plan.component.html',
  styles: ``
})
export class PlanComponent {

  public planFormGroup!:FormGroup;

  constructor(private fb:FormBuilder, private validatorService:ValidatorService, private planService:PlanService){
    this.planFormGroup = this.fb.group({
      plan_name: ['', [Validators.required]],
      planDetail_from: ['', [Validators.required, Validators.pattern(validatorService.floatPattern)]],
      planDetail_to: ['', [Validators.required, Validators.pattern(validatorService.floatPattern)]],
      planDetail_tolerance: ['', [Validators.required, Validators.pattern(validatorService.floatPattern)]],
      planDetail_priceXdoc: ['', [Validators.required, Validators.pattern(validatorService.floatPattern)]],
    });
  }

  isValidField(field: string): boolean | null {
    return this.validatorService.isValidField(this.planFormGroup, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.planFormGroup, field);
  }

  onSubmit(){
    this.planFormGroup.markAllAsTouched();

    if (this.planFormGroup.valid) {
      this.planService.storePlan(this.planFormGroup.value).subscribe(res => {
        console.log(res)
      });

      this.planFormGroup.reset();
    }
  }

}
