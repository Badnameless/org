import { Component, computed, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStats } from './interfaces/data-stats';
import { MetricsService } from '../../service/metrics.service';
import { Tenant } from '../../../features/auth/interfaces/user';
import { MonthStats } from '../../interfaces/month-stats';

@Component({
  standalone: true,
  selector: 'app-stats-widget',
  imports: [CommonModule],
  templateUrl: './statswidget.component.html',
  styleUrl: './statswidget.component.css'
})
export class StatsWidget implements OnInit {

  @Input()
  data!: DataStats[];

  constructor(public metrics: MetricsService) { }

  async ngOnInit() {
    const currentTenant: Tenant = JSON.parse(localStorage.getItem('current_tenant')!);
    await this.metrics.getMonthStats(currentTenant.tenant_id);
  }

}
