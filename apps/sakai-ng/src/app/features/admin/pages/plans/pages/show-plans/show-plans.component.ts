import { Component, computed } from '@angular/core';
import { DataGridComponent } from '../../../../../../shared/component/data-grid/data-grid.component';
import { Column } from '../../../../../../shared/component/data-grid/interfaces/column';
import { lastValueFrom } from 'rxjs';
import { PlanService } from '../../services/plan.service';
import { Plan } from '../../interfaces/plan';
import { UpdateAddPlanComponent } from '../../UpdateAddplan.component';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-show-plans',
  imports: [DataGridComponent, UpdateAddPlanComponent],
  templateUrl: './show-plans.component.html',
  styles: ``,
  providers: [DialogService]
})
export class ShowPlansComponent {

  constructor(protected planService: PlanService, public dialogService: DialogService) {
    planService.getPlans();
  }

  columns: Column[] = [];
  plans = computed<Plan[]>(() => this.planService.plans());
  addFormref!: DynamicDialogRef;
  filterFields: string[] = ['plan_name'];

  async ngOnInit() {
    await this.loadPlans();
  }

  show(plan?: Plan) {
    if (plan) {
      const { plan_name, planDetail_from, planDetail_to, planDetail_tolerance, planDetail_priceXdoc, plan_id } = plan
      const filteredPlan = { plan_name, planDetail_from, planDetail_to, planDetail_tolerance, planDetail_priceXdoc, plan_id }

      this.addFormref = this.dialogService.open(UpdateAddPlanComponent,
        {
          header: 'Modificar un plan',
          closable: true,
          modal: true,
          width: '20vw',
          inputValues: filteredPlan,
          breakpoints: {
            '545px': '85vw',
          },
        })
    } else {
      this.addFormref = this.dialogService.open(UpdateAddPlanComponent,
        {
          header: 'Agregar un plan',
          closable: true,
          modal: true,
          width: '20vw',
          breakpoints: {
            '545px': '85vw',
          },
        })
    }
  }

  async loadPlans() {
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
      {
        name: 'Desde',
        field: 'planDetail_from',
        type: 'numeric'
      },
      {
        name: 'Hasta',
        field: 'planDetail_to',
        type: 'numeric'
      },
      {
        name: 'P/ Documento',
        field: 'planDetail_priceXdoc',
        type: 'numeric'
      },
      {
        name: 'Tolerancia',
        field: 'planDetail_tolerance',
        type: 'numeric'
      },
    ];
  }
}
