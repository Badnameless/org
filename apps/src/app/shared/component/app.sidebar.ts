import { Component, ElementRef, OnInit } from '@angular/core';
import { AppMenu } from './app.menu';
import { AuthService } from '../../features/auth/services/auth.service';
import { User } from '../../features/auth/interfaces/user';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef, private authService:AuthService) {}

}
