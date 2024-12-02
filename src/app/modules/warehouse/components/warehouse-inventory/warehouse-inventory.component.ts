import {Component} from '@angular/core';
import {WarehouseNavbarComponent} from '../warehouse-navbar/warehouse-navbar.component';
import {RouterLink} from '@angular/router';
import {InventoryService} from '../../services/inventory.service';
import {DecimalPipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-warehouse-inventory',
  standalone: true,
  imports: [
    WarehouseNavbarComponent,
    RouterLink,
    NgForOf,
    DecimalPipe
  ],
  templateUrl: './warehouse-inventory.component.html',
  styleUrl: './warehouse-inventory.component.scss'
})
export class WarehouseInventoryComponent {
  inventory: { product: any; stock: number }[] = [];

  constructor(private inventoryService: InventoryService) {
  }

  ngOnInit(): void {
    this.inventoryService.getInventory().subscribe(data => {
      this.inventory = data;
    });
  }
}
