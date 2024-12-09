import {Component} from '@angular/core';
import {WarehouseNavbarComponent} from '../warehouse-navbar/warehouse-navbar.component';
import {InventoryComponent} from '../inventory/inventory.component';
import {Inventory} from '../../interfaces/warehouse';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [
    WarehouseNavbarComponent,
    InventoryComponent,
  ],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent {
  public template: string = "LIST";
  public editInventory: Inventory | null = null;

  getTemplate(template: string) {
    this.template = template;
  }

  getEdit(inventory: Inventory) {
    this.editInventory = inventory;
    this.getTemplate("EDIT");
  }
}
