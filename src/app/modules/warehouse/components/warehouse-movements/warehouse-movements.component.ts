import {Component} from '@angular/core';
import {WarehouseMovementsEditComponent} from '../warehouse-movements-edit/warehouse-movements-edit.component';
import {WarehouseMovementsListComponent} from '../warehouse-movements-list/warehouse-movements-list.component';
import {WarehouseMovementsNewComponent} from '../warehouse-movements-new/warehouse-movements-new.component';
import {WarehouseNavbarComponent} from '../warehouse-navbar/warehouse-navbar.component';
import {Movement} from '../../interfaces/warehouse';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-warehouse-movements',
  standalone: true,
  imports: [
    WarehouseMovementsEditComponent,
    WarehouseMovementsListComponent,
    WarehouseMovementsNewComponent,
    WarehouseNavbarComponent,
    RouterLink
  ],
  templateUrl: './warehouse-movements.component.html',
  styleUrl: './warehouse-movements.component.scss'
})
export class WarehouseMovementsComponent {
  public movementEdit: Movement | null = null;

  getMovementEdit(movement: Movement): void {
    this.movementEdit = movement;
  }

  getCancel(cancel: boolean): void {
    if (cancel) {
      this.movementEdit = null;
    }
  }
}
