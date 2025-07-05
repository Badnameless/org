import { Component, OnInit } from '@angular/core';
import { StatsWidget } from '../../shared/component/statswidget/statswidget.component';
import { RevenueStreamWidget } from '../../shared/component/revenuestreamwidget/revenuestreamwidget.component';
import { DataStats } from '../../shared/component/statswidget/interfaces/data-stats';
import { EncfService } from '../encf/services/encf-service.service';
import { Ncf } from '../encf/interfaces/encf';
import { Tenant } from '../auth/interfaces/user';
import { DateOption } from '../../shared/component/revenuestreamwidget/interfaces/DateOptions';
import { DoughnutChartComponent } from '../../shared/component/doughnut-chart/doughnut-chart.component';
import { CommonModule } from '@angular/common';
import { MetricsService } from '../../shared/service/metrics.service';
@Component({
  selector: 'app-dashboard',
  imports: [StatsWidget, RevenueStreamWidget, DoughnutChartComponent, CommonModule],
  templateUrl: './dashboard.html',
})
export class Dashboard { }
