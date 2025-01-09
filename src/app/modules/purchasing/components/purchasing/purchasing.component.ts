import {Component} from '@angular/core';
import {PurchasingNavbarComponent} from './purchasing-navbar/purchasing-navbar.component';
import {PurchaseOrder} from '../../interfaces/purchase-order';
import {PurchasingListComponent} from './purchasing-list/purchasing-list.component';
import {PurchasingNewComponent} from './purchasing-new/purchasing-new.component';
import {PurchasingEditComponent} from './purchasing-edit/purchasing-edit.component';

@Component({
  selector: 'app-purchasing',
  standalone: true,
  imports: [
    PurchasingNavbarComponent,
    PurchasingListComponent,
    PurchasingNewComponent,
    PurchasingEditComponent
  ],
  templateUrl: './purchasing.component.html',
  styleUrl: './purchasing.component.scss'
})
export class PurchasingComponent {
  /** VARIABLES **/
  public template: string = "LIST";
  public selectedOrder: PurchaseOrder | null = null;

  getTemplate(template: string): void {
    this.template = template;
  }

  getOrderSelected(order: PurchaseOrder): void {
    if (order) {
      this.selectedOrder = order;
      this.template = "EDIT";
    }

  }

  getCancel(cancel: boolean): void {
    if (cancel) {
      this.selectedOrder = null;
      this.template = "LIST";
    }
  }
}
