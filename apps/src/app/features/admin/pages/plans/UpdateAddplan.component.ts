import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ValidatorService } from '../../../../services/validator.service';
import { PlanService } from './services/plan.service';
import { lastValueFrom } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-plan',
  imports: [MessageModule, CommonModule, ReactiveFormsModule, InputTextModule, FluidModule, ButtonModule, SelectModule, TextareaModule],
  templateUrl: './UpdateAddplan.component.html',
  styles: ``
})
export class UpdateAddPlanComponent implements OnInit {

  isLoading = signal<boolean>(false);

  public planFormGroup!: FormGroup;

  @Input()
  public plan_name!: string;

  @Input()
  public planDetail_from!: string;

  @Input()
  public planDetail_to!: string;

  @Input()
  public planDetail_tolerance!: string;

  @Input()
  public planDetail_priceXdoc!: string;

  @Input()
  public plan_id!: number;

  public buttonText: string = '';

  ngOnInit(): void {
    this.planFormGroup.controls['plan_name'].setValue(this.plan_name);
    this.planFormGroup.controls['planDetail_from'].setValue(this.planDetail_from);
    this.planFormGroup.controls['planDetail_to'].setValue(this.planDetail_to);
    this.planFormGroup.controls['planDetail_tolerance'].setValue(this.planDetail_tolerance);
    this.planFormGroup.controls['planDetail_priceXdoc'].setValue(this.planDetail_priceXdoc);
    this.planFormGroup.controls['plan_id'].setValue(this.plan_id);

    this.buttonText = this.plan_id ? 'Modificar' : 'Agregar';
  }

  constructor(private fb: FormBuilder, private validatorService: ValidatorService, private planService: PlanService, private ref: DynamicDialogRef) {
    this.planFormGroup = this.fb.group({
      plan_name: ['', [Validators.required]],
      planDetail_from: ['', [Validators.required, Validators.pattern(validatorService.floatPattern)]],
      planDetail_to: ['', [Validators.required, Validators.pattern(validatorService.floatPattern)]],
      planDetail_tolerance: ['', [Validators.required, Validators.pattern(validatorService.floatPattern)]],
      planDetail_priceXdoc: ['', [Validators.required, Validators.pattern(validatorService.floatPattern)]],
      plan_id: [''],
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

      this.isLoading.set(true)

      if (this.plan_id) {
        await this.planService.updatePlan(this.planFormGroup.value, this.plan_id)
      } else {
        await this.planService.storePlan(this.planFormGroup.value);
      }

      this.isLoading.set(false)

      this.planFormGroup.reset();
      this.ref.close();
    }
  }

}
