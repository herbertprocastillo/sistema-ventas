import {Component} from '@angular/core';
import {WarehouseNavbarComponent} from '../warehouse-navbar/warehouse-navbar.component';
import {WarehouseEditComponent} from '../warehouse-edit/warehouse-edit.component';
import {WarehouseNewComponent} from '../warehouse-new/warehouse-new.component';
import {WarehouseListComponent} from '../warehouse-list/warehouse-list.component';
import {Warehouse} from '../../interfaces/warehouse';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [
    WarehouseNavbarComponent,
    WarehouseEditComponent,
    WarehouseNewComponent,
    WarehouseListComponent,
    RouterLink,
  ],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent {
  /** VARIABLES **/
  public editWarehouse: Warehouse | null = null;

  getEditWarehouse(warehouse: Warehouse): void {
    this.editWarehouse = warehouse;
  }

  getCancel(cancel: boolean): void {
    if (cancel) {
      this.editWarehouse = null;
    }
  }
}
