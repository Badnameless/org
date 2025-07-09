import { Component, effect, input, OnInit} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../service/layout.service';
import { BarMetric } from '../../interfaces/metrics';

@Component({
  standalone: true,
  selector: 'app-revenue-stream-widget',
  imports: [ChartModule],
  templateUrl: 'revenuestreamwidget.component.html',
  styleUrl: 'revenuestreamwidget.component.css'
})
export class RevenueStreamWidget implements OnInit {

  chartData!: any;
  chartOptions!: any;

  barMetrics = input<BarMetric[] | null>(null)

  constructor(public layoutService: LayoutService) {
    effect(() => {
      this.initChartData()
    })
  }

  async ngOnInit() {
    this.initChartData();
  }

  initChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    this.chartData = {
      labels: this.barMetrics()!.map(stat => `Tipo ${stat.tipoNcf_code}`),
      datasets: [
        {
          data: this.barMetrics()!.map(stat => stat.quantity),
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
