import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StatsWidget } from '../../shared/component/statswidget/statswidget.component';
import { RevenueStreamWidget } from '../../shared/component/revenuestreamwidget/revenuestreamwidget.component';
import { DataStats } from '../../shared/component/statswidget/interfaces/data-stats';
import { EncfService } from '../encf/services/encf-service.service';
import { Ncf } from '../encf/interfaces/encf';
import { firstValueFrom } from 'rxjs';
import { Tenant } from '../auth/interfaces/user';
@Component({
  selector: 'app-dashboard',
  imports: [StatsWidget, RevenueStreamWidget],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  constructor(private encfService: EncfService) { }

  title!: any;
  statData!: DataStats[];
  chartData!: any;
  chartOptions!: any;
  encfs!: Ncf[];
  tenant!: Tenant;

  async ngOnInit() {
    this.title = `E-NCFs Emitidos - ${new Date().getFullYear()}`

    this.encfs = await firstValueFrom(this.encfService.getEncfs())

    this.initChartData();
    this.initStatData();
  }

  getStadistics(status: number): number[]{
    let anual: number[] = []
    let counter: number = 0;

    for(let i = 0; i <= 12; i++){
      this.encfs.forEach(encf => {
        const date = new Date(encf.transncf_fechaemision)
        if(date.getMonth() === i && encf.transncf_status === status){
          if(date.getFullYear() === new Date().getFullYear()) counter++;
        }
      })
      anual.push(counter)
      counter = 0;
    }

    return anual;
  }

  initChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    this.chartData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      datasets: [
        {
          type: 'bar',
          label: 'Aceptado',
          backgroundColor: 'rgba(82, 190, 128)',
          data: this.getStadistics(1),
        },
        {
          type: 'bar',
          label: 'Rechazado',
          backgroundColor: 'rgba(205, 97, 85)',
          data: this.getStadistics(2),
        },
        {
          type: 'bar',
          label: 'Pendiente',
          backgroundColor: 'rgba(245, 176, 65)',
          data: this.getStadistics(3),
        },
        {
          type: 'bar',
          label: 'Acept. Condicional',
          backgroundColor: 'rgba(93, 173, 226)',
          data: this.getStadistics(4),
          borderSkipped: false,
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
    };
  }

  getAceptados(){

  }

  initStatData() {
    let encfsAceptados: number = 0;
    let encfsRechazados: number = 0;
    let encfsTotales: number = 0;

    console.log(this.encfs)

    this.encfs.forEach(encf => {
      const date = new Date(encf.transncf_fechaemision)
      if (date.getFullYear() === new Date().getFullYear()) {
        encfsTotales++
      }
    })

    this.encfs.forEach(encf => {
      const date = new Date(encf.transncf_fechaemision)
      if (encf.transncf_status === 1 || encf.transncf_status === 4) {
        if(date.getFullYear() === new Date().getFullYear()) encfsAceptados++
      }
    })

    this.encfs.forEach(encf => {
      const date = new Date(encf.transncf_fechaemision)
      if (encf.transncf_status === 2 && date.getFullYear() === new Date().getFullYear()) {
        encfsRechazados++
      }
    })

    this.statData = [
      {
        name: 'E-NCFs totales',
        stat: encfsTotales,
        subtext: 'E-NCFs totales emitidos este año',
        icon: 'pi pi-receipt text-blue-500'
      },
      {
        name: 'E-NCFs aceptados',
        stat: encfsAceptados,
        subtext: 'E-NCFs totales aceptados este año',
        icon: 'pi pi-check text-green-500'
      },
      {
        name: 'E-NCFs rechazados',
        stat: encfsRechazados,
        subtext: 'E-NCFs totales rechazados este año',
        icon: 'pi pi-times text-red-500'
      }
    ]
  }
}
