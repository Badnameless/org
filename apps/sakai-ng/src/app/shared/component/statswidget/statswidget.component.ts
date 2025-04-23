import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStats } from './interfaces/data-stats';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    templateUrl: './statswidget.component.html',
})
export class StatsWidget {
  @Input()
  data!: DataStats[];
}
