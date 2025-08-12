import { Component, effect, input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NotFoundMessageComponent } from '../not-found-message/not-found-message.component';
import { DoughnutColorMap } from '../../utils/DoughnutColorMap';
import { LoaderComponent } from '../loader/loader.component';
import { DoughnutMetric } from '../../interfaces/metrics';

@Component({
  selector: 'app-doughnut-chart',
  imports: [ChartModule, CommonModule, NotFoundMessageComponent, LoaderComponent],
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.css'
})
export class DoughnutChartComponent implements OnInit {

  public pieData: any;
  public pieOptions: any;

  private currencyType = new CurrencyPipe('EN');

  doughnutMetrics = input<DoughnutMetric[] | null>(null);
  isLoading = input<boolean>(false);

  constructor() {
    effect(() => {
      this.initDoughnutChart()
    })
  }

  async ngOnInit() {
    this.initDoughnutChart();
  }

  initDoughnutChart() {
    this.pieData = {
      labels: this.doughnutMetrics()!.map(stat => `Tipo ${stat.tipoNcf_code}`),
      datasets: [
        {
          data: this.doughnutMetrics()!.map(stat => stat.quantity),
          backgroundColor: this.doughnutMetrics()!.map(stat => DoughnutColorMap.get(stat.tipoNcf_code)),

        },
        {
          data: this.doughnutMetrics()!
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
              const stats = context.chart.data.datasets[1].data as DoughnutMetric[];
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
}
