import { Component, effect, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NotFoundMessageComponent } from '../not-found-message/not-found-message.component';
import { MetricsService } from '../../service/metrics.service';
import { Tenant } from '../../../features/auth/interfaces/user';
import { DoughnutColorMap } from '../../utils/DoughnutColorMap';
import { DoughnutStats } from '../../interfaces/doughnut-stats';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-doughnut-chart',
  imports: [ChartModule, DatePickerModule, ReactiveFormsModule, MessageModule, CommonModule, NotFoundMessageComponent, LoaderComponent],
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.css'
})
export class DoughnutChartComponent implements OnInit {

  public pieData: any;

  public pieOptions: any;

  public dateFormat: string = 'dd/mm/yy';

  public dateError: boolean = false

  fromDateControl = new FormControl();

  toDateControl = new FormControl();

  private currencyType = new CurrencyPipe('EN');

  public isLoading = signal<boolean>(true);

  constructor(private metrics: MetricsService) {
    effect(() => {
      this.initDoughnutChart()
    })
  }

  async ngOnInit() {
    const currentTenant: Tenant = JSON.parse(localStorage.getItem('current_tenant')!);
    await this.metrics.calculateDoughnutStats(currentTenant.tenant_id);
    this.setDates();

    this.isLoading.set(false);

    this.initDoughnutChart();

    this.fromDateControl.valueChanges.subscribe(() => {
      this.onChangeDate();
    });

    this.toDateControl.valueChanges.subscribe(() => {
      this.onChangeDate();
    });
  }

  setDates(){
    const today: Date = new Date();

    const donughDates: Date[] = [
      new Date(today.getFullYear(), today.getMonth(), 1),
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    ]

    this.fromDateControl.setValue(donughDates[0]);
    this.toDateControl.setValue(donughDates[1]);
  }

  initDoughnutChart() {
    this.pieData = {
      labels: this.metrics.doughnutStats().map(stat => `Tipo ${stat.tipoNcf_code}`),
      datasets: [
        {
          data: this.metrics.doughnutStats().map(stat => stat.quantity),
          backgroundColor: this.metrics.doughnutStats().map(stat => DoughnutColorMap.get(stat.tipoNcf_code)),

        },
        {
          data: this.metrics.doughnutStats()
        }
      ]
    };

    this.pieOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              let label = context.label as string;
              let ncfType: number = Number(label.slice(label.length - 2));
              const stats = context.chart.data.datasets[1].data as DoughnutStats[];
              const stat = stats.find(stat => stat.tipoNcf_code === ncfType)

              return [
                `${stat?.tipoNcf_name}`,
                `Cantidad: ${stat?.quantity}`,
                `Total ITBIS: ${this.currencyType.transform(stat?.itbistotal)}`,
                `Monto Total: ${this.currencyType.transform(stat?.montototal)}`
              ];
            }
          }
        },
        legend: {
          labels: {
            usePointStyle: true,
          }
        }
      },
      widthpx: '90'
    };
  }


  onChangeDate() {
    this.isLoading.set(true);
    let dates: Date[] = [
      this.fromDateControl.value,
      this.toDateControl.value
    ];

    if (dates[0] > dates[1] || dates[1] < dates[0]) {
      this.dateError = true;
      this.isLoading.set(false);
      return;
    }

    this.dateError = false;

    const currentTenant: Tenant = JSON.parse(localStorage.getItem('current_tenant')!);
    this.metrics.calculateDoughnutStats(this.metrics.tenantId, dates)
    this.isLoading.set(false);
  }
}
