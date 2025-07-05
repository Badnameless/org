import { Component, effect, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../service/layout.service';
import { SelectModule } from 'primeng/select';
import { DateOption } from './interfaces/DateOptions';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MetricsService } from '../../service/metrics.service';

@Component({
  standalone: true,
  selector: 'app-revenue-stream-widget',
  imports: [ChartModule, SelectModule, ReactiveFormsModule],
  templateUrl: 'revenuestreamwidget.component.html',
  styleUrl: 'revenuestreamwidget.component.css'
})
export class RevenueStreamWidget implements OnInit {

  chartData!: any;
  chartOptions!: any;
  subscription!: Subscription;
  timeFilter = new FormControl();

  public filterDataOptions: DateOption[] = [
    {
      label: 'Ultimos 7 días',
      division: 'week',
      value: 1
    },
    {
      label: 'Ultimo mes',
      division: 'month',
      value: 1
    },
    {
      label: 'Ultimos 3 meses',
      division: 'month',
      value: 3
    },
    {
      label: 'Ultimo año',
      division: 'year',
      value: 1
    },
  ];

  public selectedTime: DateOption = this.filterDataOptions[1];

  constructor(public layoutService: LayoutService, private metrics: MetricsService) {
    effect(() => {
      console.log('hey')
      metrics.calculateBarStats(metrics.tenantId)
    })
    this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => { });
  }

  async ngOnInit() {
    this.timeFilter.setValue(this.selectedTime);
    await this.metrics.calculateBarStats(this.metrics.tenantId, this.selectedTime);
    this.initChartData();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onChangeTime() {
    const timeSelected: DateOption = this.timeFilter.value;
    await this.metrics.calculateBarStats(this.metrics.tenantId, timeSelected)
    this.initChartData();
  }

  initChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    this.chartData = {
      labels: this.metrics.barStats().map(stat => `Tipo ${stat.tipoNcf_code}`),
      datasets: [
        {
          data: this.metrics.barStats().map(stat => stat.quantity),
          backgroundColor: documentStyle.getPropertyValue('--p-primary-400')
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      maintainAspectRatio: false,
      aspectRatio: 0.8,
    }
  }
}
