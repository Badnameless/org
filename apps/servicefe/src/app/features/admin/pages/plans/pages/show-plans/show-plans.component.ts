import { Component } from '@angular/core';
import { DataGridComponent } from '../../../../../../shared/component/data-grid/data-grid.component';
import { Column } from '../../../../../../shared/component/data-grid/interfaces/column';
import { lastValueFrom } from 'rxjs';
import { PlanService } from '../../services/plan.service';
import { Plan } from '../../interfaces/plan';
import { AddPlanComponent } from '../../Addplan.component';

@Component({
  selector: 'app-show-plans',
  imports: [DataGridComponent, AddPlanComponent],
  templateUrl: './show-plans.component.html',
  styles: ``
})
export class ShowPlansComponent {
  constructor(protected planService: PlanService) { }

  columns: Column[] = [];
  plans!: Plan[];

  async ngOnInit() {
    await this.loadPlans();
  }

  async loadPlans() {
    this.plans = await lastValueFrom(this.planService.getPlans());
    this.plans = this.plans.map(plan => (
      {
        ...plan,
        ...plan.plan,
      }))

    console.log(this.plans)

    this.columns = [
      {
        name: 'id',
        field: 'plan_id',
        type: 'hidden'
      },
      {
        name: 'Plan',
        field: 'plan_name',
        type: 'text'
      },
    ];
  }
}
