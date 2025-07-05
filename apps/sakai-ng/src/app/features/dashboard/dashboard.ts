import { Component, OnInit } from '@angular/core';
import { StatsWidget } from '../../shared/component/statswidget/statswidget.component';
import { RevenueStreamWidget } from '../../shared/component/revenuestreamwidget/revenuestreamwidget.component';
import { DataStats } from '../../shared/component/statswidget/interfaces/data-stats';
import { EncfService } from '../encf/services/encf-service.service';
import { Ncf } from '../encf/interfaces/encf';
import { Tenant } from '../auth/interfaces/user';
import { DateOption } from '../../shared/component/revenuestreamwidget/interfaces/DateOptions';
import { DoughnutChartComponent } from '../../shared/component/doughnut-chart/doughnut-chart.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
  private currencyType = new CurrencyPipe('EN');


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
    { code: 31, encf: <Ncf[]>[], color: 'rgba(25, 111, 61)' },
    { code: 32, encf: <Ncf[]>[], color: 'rgba(205, 97, 85)' },
    { code: 33, encf: <Ncf[]>[], color: 'rgba(245, 176, 65)' },
    { code: 34, encf: <Ncf[]>[], color: 'rgba(93, 173, 226)' },
    { code: 41, encf: <Ncf[]>[], color: 'rgba(69, 179, 157)' },
    { code: 43, encf: <Ncf[]>[], color: 'rgba(255, 160, 122)' },
    { code: 44, encf: <Ncf[]>[], color: 'rgba(206, 147, 216)' },
    { code: 45, encf: <Ncf[]>[], color: 'rgba(0, 102, 102)' },
  ];

  async ngOnInit() {
    this.title = `E-NCFs En General`
    this.encfs = await this.encfService.getEncfs()

    this.initChartData(this.filterDataOptions[1]);
    this.initStatData();
    this.initDoughnutData(this.donughDates);
  }

  drawBarGraphic(stats: any) {
    this.chartData = {
      labels: ['Tipo 31', 'Tipo 32', 'Tipo 33', 'Tipo 34', 'Tipo 41', 'Tipo 43', 'Tipo 44', 'Tipo 45'],
      datasets: [
        {
          backgroundColor: this.documentStyle.getPropertyValue('--p-primary-400'),
          data: stats.map((s: { encf: Ncf[] } ) => s.encf.length)
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
        type: 'wholeNumber',
        icon: 'pi pi-receipt text-blue-500'
      },
      {
        name: 'E-NCFs aceptados',
        stat: this.getCardEncfStatus([1, 4]),
        type: 'wholeNumber',
        icon: 'pi pi-check text-green-500'
      },
      {
        name: 'E-NCFs rechazados',
        stat: this.getCardEncfStatus([2]),
        type: 'wholeNumber',
        icon: 'pi pi-times text-red-500'
      },
      {
        name: 'ITBIS total',
        stat: this.getTotalItbis(),
        type: 'currency',
        icon: 'pi pi-dollar text-teal-500'
      }
    ]
  }

  initDoughnutData(dates: Date[]) {
    let stats = this.getDoughnutStadistics(dates)

    const filteredStats = stats.filter(stat => stat.encf.length > 0);

    if (filteredStats.length === 0) {
      this.pieData = null;
      return;
    }

    this.pieData = {
      labels: filteredStats.map(stat => `Tipo ${stat.code}`),
      datasets: [
        {
          data: filteredStats.map(stat => stat.encf.length),

          backgroundColor: filteredStats.map(stat => stat.color),

        },
        {
          data: filteredStats.map(stat => stat.encf)
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
              let ncfName: string = '';
              let totalItbis: number = 0;
              let montoTotal: number = 0;
              let cantNcf: number = 0;
              const dataNcf = context.chart.data.datasets[1].data as [Ncf[]];

              dataNcf.forEach((element: Ncf[]) => {
                element.forEach(ncf => {
                  if (ncf.tipoNcf_code == ncfType) {
                    totalItbis += Number(ncf.transncf_itbis);
                    montoTotal += Number(ncf.transncf_montototal);
                    cantNcf++;
                    ncfName = ncf.tipoNcf_code == ncfType ? ncf.tipoNcf_name : ncfName;
                  } else {

                  }
                })
              });

              return [
                `${ncfName}`,
                `Cantidad: ${cantNcf}`,
                `Total ITBIS: RD${this.currencyType.transform(totalItbis)}`,
                `Monto Total: RD${this.currencyType.transform(montoTotal)}`
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
      tipo.encf = this.encfs.filter(encf => {
        const date = new Date(encf.transncf_fechaemision);
        const diffInDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return encf.tipoNcf_code === tipo.code && diffInDays >= 0 && diffInDays < 7;
      });
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
      tipo.encf = this.encfs.filter(encf => {
        const encfDate = new Date(encf.transncf_fechaemision);
        const encfKey = this.formatMonthYear(encfDate);
        return encf.tipoNcf_code === tipo.code && validMonthKeys.includes(encfKey);
      });
    });

    return this.tipos;
  }

  getStadisticsByTypeYearly() {
    this.tipos.forEach(tipo => {
      tipo.encf = this.encfs.filter(encf => {
        const encfDate = new Date(encf.transncf_fechaemision);
        return encf.tipoNcf_code === tipo.code && encfDate.getFullYear() === this.today.getFullYear();
      });
    });

    return this.tipos;
  }

  getDoughnutStadistics(dates: Date[]) {
    let status: number[] = [1, 4];
    let counter: number = 0;

    this.tipos.forEach(tipo => {
      tipo.encf = this.encfs.filter(encf => {
        const date = new Date(encf.transncf_fechaemision);

        return encf.tipoNcf_code === tipo.code && date >= dates[0] && date <= dates[1] && status.includes(encf.transncf_status);
      });
    });

    return this.tipos;
  }
}
