import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-tray',
  imports: [],
  templateUrl: './notification-tray.component.html',
  styles: ``,
  host: {
    class: 'hidden absolute top-[3.30rem] right-0 w-96 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]'
}
})
export class NotificationTrayComponent {

}
