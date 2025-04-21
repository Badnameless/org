import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { Component, EventEmitter, Output } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ValidatorService } from '../../../../services/validator.service';
import { PlanService } from './services/plan.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-plan',
  imports: [MessageModule, CommonModule, ReactiveFormsModule, InputTextModule, FluidModule, ButtonModule, SelectModule, TextareaModule],
  templateUrl: './Addplan.component.html',
  styles: ``
})
export class AddPlanComponent {

  @Output() onSuccess = new EventEmitter<void>();

  public planFormGroup!: FormGroup;

  constructor(private fb: FormBuilder, private validatorService: ValidatorService, private planService: PlanService) {
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

  async onSubmit() {
    this.planFormGroup.markAllAsTouched();

    if (this.planFormGroup.valid) {
      await lastValueFrom(this.planService.storePlan(this.planFormGroup.value));

      this.planFormGroup.reset();
      this.onSuccess.emit();
      window.location.reload();
    }
  }

}
