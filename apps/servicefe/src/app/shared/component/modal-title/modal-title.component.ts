import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-title',
  imports: [],
  templateUrl: './modal-title.component.html',
  styles: ``
})
export class ModalTitleComponent {
  @Input()
  public title: string = '';

  @Input()
  public subtitle: string = '';

}
