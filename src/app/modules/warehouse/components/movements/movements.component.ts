import {Component} from '@angular/core';
import {WarehouseNavbarComponent} from '../warehouse-navbar/warehouse-navbar.component';
import {MovementsNewComponent} from './movements-new/movements-new.component';
import {Movement} from '../../interfaces/warehouse';
import {MovementsListComponent} from './movements-list/movements-list.component';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [
    WarehouseNavbarComponent,
    MovementsNewComponent,
    MovementsListComponent
  ],
  templateUrl: './movements.component.html',
  styleUrl: './movements.component.scss'
})
export class MovementsComponent {
  /** VARIABLES **/
  public template: string = "LIST";
  public editMovement: Movement | null = null;

  getTemplate(template: string): void {
    this.template = template;
  }

  getCancel(cancel: boolean): void {
    if (cancel) {
      this.editMovement = null;
      this.template = "LIST";
    }
  }
}
