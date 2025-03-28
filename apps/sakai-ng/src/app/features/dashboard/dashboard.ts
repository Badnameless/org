import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatsWidget } from './components/statswidget/statswidget.component';
import { RevenueStreamWidget } from './components/revenuestreamwidget/revenuestreamwidget.component';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RevenueStreamWidget],
    templateUrl: './dashboard.html',
})
export class Dashboard {}
