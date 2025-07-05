import { Injectable, OnInit } from '@angular/core';
import { CompanyService } from '../features/admin/pages/companies/services/company.service';
import { EncfService } from '../features/encf/services/encf-service.service';
import { PlanService } from '../features/admin/pages/plans/services/plan.service';
import { UserService } from '../features/admin/pages/users/services/user.service';
import { forkJoin, from } from 'rxjs';
import { NotificationService } from '../shared/service/notification.service';
import { MetricsService } from '../shared/service/metrics.service';
import { Tenant } from '../features/auth/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {

  constructor(
    private companyService: CompanyService,
    private encfService: EncfService,
    private planService: PlanService,
    private userService: UserService,
    private notificationService: NotificationService,
    private metrics: MetricsService
  ) { }

  async loadUserData() {
    const currentTenant: Tenant = JSON.parse(localStorage.getItem('current_tenant')!);
    await this.metrics.getMonthStats(currentTenant.tenant_id);
    await this.metrics.calculateDoughnutStats(currentTenant.tenant_id);
    await this.metrics.calculateBarStats(currentTenant.tenant_id);
    await this.encfService.getEncfs(10, 1);

    forkJoin([
      from(this.notificationService.getNotifications()),
    ]).subscribe();
  }

  async loadAdminData() {
    await this.planService.getPlans();
    await this.companyService.getCompanies();
    await this.userService.getUsers();
    await this.encfService.getAllEncfs(10, 1)
  }
}
