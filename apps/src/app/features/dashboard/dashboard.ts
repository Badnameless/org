import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { StatsWidget } from '../../shared/component/statswidget/statswidget.component';
import { RevenueStreamWidget } from '../../shared/component/revenuestreamwidget/revenuestreamwidget.component';
import { DateOption } from '../../shared/component/revenuestreamwidget/interfaces/DateOptions';
import { DoughnutChartComponent } from '../../shared/component/doughnut-chart/doughnut-chart.component';
import { CommonModule } from '@angular/common';
import { MetricsService } from '../../shared/service/metrics.service';
import { LocalStorageService } from '../../shared/service/local-storage-service.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-dashboard',
  imports: [StatsWidget, RevenueStreamWidget, DoughnutChartComponent, CommonModule, SelectModule, ReactiveFormsModule, DatePickerModule, MessageModule],
  templateUrl: './dashboard.html',
  styleUrl: 'dashboard.css'
})

export class Dashboard implements OnInit {

  public selectedTime!: DateOption;

  timeFilter = new FormControl();

  rangeDateControl = new FormControl();

  public dateFormat: string = 'dd/mm/yy';

  public isLoading = signal<boolean>(true);
  public dateError: boolean = false

  constructor(private local: LocalStorageService, public metrics: MetricsService) {
    effect(async () => {
      if (metrics.metrics().statMetrics === null) {
        await this.metrics.getMetrics(this.local.tenantId, this.metrics.filterDataOptions[1])
      }
    })
  }

  async ngOnInit() {
    this.initializeCustomDates();

    this.selectedTime = this.metrics.filterDataOptions[1];
    this.timeFilter.setValue(this.selectedTime);

    this.rangeDateControl.valueChanges.subscribe(() => {
      this.onChangeDate();
    });
  }

  initializeCustomDates() {
    this.rangeDateControl.disable({ emitEvent: false });
    const today = new Date();
    this.rangeDateControl.setValue([today, today])
  }

  async onChangeTime() {
    const timeSelected: DateOption = this.timeFilter.value;

    if (timeSelected.division === 'custom') {
      this.rangeDateControl.enable({ emitEvent: false });
    } else {
      this.rangeDateControl.disable({ emitEvent: false });
      await this.metrics.getMetrics(this.local.tenantId, timeSelected);
    }

  }

  async onChangeDate() {
    this.isLoading.set(true);
    const dateRange = this.rangeDateControl.value as any[];
    if (dateRange.includes(null)) return;

    let dates: Date[] = this.rangeDateControl.value

    if (dates[0] > dates[1] || dates[1] < dates[0]) {
      this.dateError = true;
      this.isLoading.set(false);
      return;
    }

    this.dateError = false;

    let dateOption = this.metrics.filterDataOptions[4];
    dateOption.dateFrom = dateRange[0];
    dateOption.dateTo = dateRange[1];

    await this.metrics.getMetrics(this.local.tenantId, dateOption);
    console.log('executed')
    this.isLoading.set(false);
  }
}
