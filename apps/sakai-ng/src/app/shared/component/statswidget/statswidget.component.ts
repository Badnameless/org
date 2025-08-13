import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatMetrics } from '../../interfaces/metrics';
@Component({
  standalone: true,
  selector: 'app-stats-widget',
  imports: [CommonModule],
  templateUrl: './statswidget.component.html',
  styleUrl: './statswidget.component.css'
})
export class StatsWidget {

  stats = input<StatMetrics | null>(null);

}
