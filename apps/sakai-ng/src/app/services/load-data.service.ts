import { Injectable } from '@angular/core';
import { CompanyService } from '../features/admin/pages/companies/services/company.service';
import { EncfService } from '../features/encf/services/encf-service.service';
import { PlanService } from '../features/admin/pages/plans/services/plan.service';
import { UserService } from '../features/admin/pages/users/services/user.service';
import { forkJoin, from } from 'rxjs';
import { NotificationService } from '../shared/service/notification.service';
import { MetricsService } from '../shared/service/metrics.service';
import { LocalStorageService } from '../shared/service/local-storage-service.service';

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
    private metrics: MetricsService,
    private local: LocalStorageService
  ) { }

  async loadUserData() {
    await this.metrics.getMetrics(this.local.tenantId, this.metrics.filterDataOptions[1]);
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
