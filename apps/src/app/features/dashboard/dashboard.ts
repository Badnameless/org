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
@Component({
  selector: 'app-dashboard',
  imports: [StatsWidget, RevenueStreamWidget, DoughnutChartComponent, CommonModule],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  constructor(
    private encfService: EncfService,
  ) { }

  public title!: any;
  public statData!: DataStats[];
  public chartData!: any;
  public chartOptions!: any;
  public encfs!: Ncf[];
  public tenant!: Tenant;
  public pieData!: any;
  public pieOptions!: any;

  public filterDataOptions: DateOption[] = [
    {
      label: 'Ultimos 7 días',
      division: 'day',
      value: 7
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

  private currentMonth = new Date().getMonth();
  private currentYear = new Date().getFullYear();
  private today: Date = new Date();

  private documentStyle = getComputedStyle(document.documentElement);

  donughDates: Date[] = [
    new Date(this.today.getFullYear(), this.today.getMonth(), 1),
    new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate())
  ]

  private tipos = [
    { code: 31, numEcfs: 0 },
    { code: 32, numEcfs: 0 },
    { code: 33, numEcfs: 0 },
    { code: 34, numEcfs: 0 },
    { code: 41, numEcfs: 0 },
    { code: 43, numEcfs: 0 },
    { code: 44, numEcfs: 0 },
    { code: 45, numEcfs: 0 },
  ];

  async ngOnInit() {
    this.title = `E-NCFs En General`
    this.encfs = await this.encfService.getEncfs()

    this.initChartData(this.filterDataOptions[1]);
    this.initStatData();
    this.initDoughnutData(this.donughDates);
  }

  drawBarGraphic(stats: any){
    this.chartData = {
      labels: ['Tipo 31', 'Tipo 32', 'Tipo 33', 'Tipo 34', 'Tipo 41', 'Tipo 43', 'Tipo 44', 'Tipo 45'],
      datasets: [
        {
          backgroundColor: this.documentStyle.getPropertyValue('--p-primary-400'),
          data: stats.map((s: { numEcfs: any; }) => s.numEcfs)
        }
      ]
    };

    return this.chartData;
  }

  initChartData(dateOption: DateOption) {

    switch (dateOption.division) {

      case 'day':
        let statsWeekly = this.getStadisticsByTypeDaily();
        this.drawBarGraphic(statsWeekly);
        break;

      case 'month':
        let statsMonthly = this.getStadisticsByTypeMonthly(dateOption.value);
        this.drawBarGraphic(statsMonthly);
        break;

      case "year":
        let statsYearly = this.getStadisticsByTypeYearly();
        this.drawBarGraphic(statsYearly);
        break;
    }



    this.chartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      maintainAspectRatio: false,
      aspectRatio: 0.8,
    };
  }

  onChangeTime(dateOption: DateOption) {
    this.initChartData(dateOption);
  }

  initStatData() {
    this.statData = [
      {
        name: 'E-NCFs totales',
        stat: this.getCardEncfStatus([1, 2, 3, 4]),
        subtext: 'E-NCFs totales emitidos este mes',
        type: 'wholeNumber',
        icon: 'pi pi-receipt text-blue-500'
      },
      {
        name: 'E-NCFs aceptados',
        stat: this.getCardEncfStatus([1, 4]),
        subtext: 'E-NCFs aceptados este mes',
        type: 'wholeNumber',
        icon: 'pi pi-check text-green-500'
      },
      {
        name: 'E-NCFs rechazados',
        stat: this.getCardEncfStatus([2]),
        subtext: 'E-NCFs rechazados este mes',
        type: 'wholeNumber',
        icon: 'pi pi-times text-red-500'
      },
      {
        name: 'ITBIS total',
        stat: this.getTotalItbis(),
        subtext: 'ITBIS Total este mes',
        type: 'currency',
        icon: 'pi pi-dollar text-teal-700'
      }
    ]
  }

  initDoughnutData(dates: Date[]) {
    let stats = this.getDoughnutStadistics(dates)

    let data: number = 0;
    stats.forEach(stat => {
      data += stat.numEcfs;
    })

    if(data < 1) {
      this.pieData = null
      return;
    }

    this.pieData = {
      labels: ['Tipo 31', 'Tipo 32', 'Tipo 33', 'Tipo 34', 'Tipo 41', 'Tipo 43', 'Tipo 44', 'Tipo 45'],
      datasets: [
        {
          data: [
            stats[0].numEcfs,
            stats[1].numEcfs,
            stats[2].numEcfs,
            stats[3].numEcfs,
            stats[4].numEcfs,
            stats[5].numEcfs,
            stats[6].numEcfs,
            stats[7].numEcfs,
          ],
          backgroundColor: [
            'rgba(25, 111, 61)',
            'rgba(205, 97, 85)',
            'rgba(245, 176, 65)',
            'rgba(93, 173, 226)',
            'rgba(69, 179, 157)',
            'rgba(255, 160, 122)',
            'rgba(206, 147, 216)',
            'rgba(0, 102, 102)',
          ]
        }
      ]
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          }
        }
      },
      widthpx: '90'
    };
  }

  onChangeTimeDoughnut(dates: Date[]) {
    this.initDoughnutData(dates);
  }

  getCardEncfStatus(status: number[]): number {
    let encfCounter: number = 0;

    this.encfs.forEach(encf => {
      const date = new Date(encf.transncf_fechaemision)
      if (status.includes(encf.transncf_status)) {
        if (date.getMonth() === this.currentMonth && date.getFullYear() === this.currentYear) encfCounter++
      }
    })
    return encfCounter
  }

  getTotalItbis(): number {
    let status: number[] = [1, 4];

    let itbis: number = 0;
    this.encfs.forEach(encf => {
      const date = new Date(encf.transncf_fechaemision)
      if (date.getMonth() === this.currentMonth && date.getFullYear() === this.currentYear && status.includes(encf.transncf_status)) itbis += Number(encf.transncf_itbis)
    })
    return itbis
  }

  getStadisticsByTypeDaily() {
    const today = new Date();

    this.tipos.forEach(tipo => {
      tipo.numEcfs = this.encfs.filter(encf => {
        const date = new Date(encf.transncf_fechaemision);
        const diffInDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return encf.tipoNcf_code === tipo.code && diffInDays >= 0 && diffInDays < 7;
      }).length;
    });

    return this.tipos;
  }

  formatMonthYear(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  getStadisticsByTypeMonthly(numMonths: number) {
    const today = new Date();

    const validMonthKeys = Array.from({ length: numMonths }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      return this.formatMonthYear(d);
    });

    this.tipos.forEach(tipo => {
      tipo.numEcfs = this.encfs.filter(encf => {
        const encfDate = new Date(encf.transncf_fechaemision);
        const encfKey = this.formatMonthYear(encfDate);
        return encf.tipoNcf_code === tipo.code && validMonthKeys.includes(encfKey);
      }).length;
    });

    return this.tipos;
  }

  getStadisticsByTypeYearly() {
    this.tipos.forEach(tipo => {
      tipo.numEcfs = this.encfs.filter(encf => {
        const encfDate = new Date(encf.transncf_fechaemision);
        return encf.tipoNcf_code === tipo.code && encfDate.getFullYear() === this.today.getFullYear();
      }).length;
    });

    return this.tipos;
  }

  getDoughnutStadistics(dates: Date[]) {
    let status: number[] = [1, 4];

    this.tipos.forEach(tipo => {
      tipo.numEcfs = this.encfs.filter(encf => {
        const date = new Date(encf.transncf_fechaemision);

        return encf.tipoNcf_code === tipo.code && date >= dates[0] && date <= dates[1] && status.includes(encf.transncf_status);
      }).length;
    });

    return this.tipos;
  }
}
