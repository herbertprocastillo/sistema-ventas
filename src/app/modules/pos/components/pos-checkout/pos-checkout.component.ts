import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Sale, SaleItem} from '../../../sales/interfaces/sale';
import {SalesService} from '../../../sales/services/sales.service';

@Component({
  selector: 'app-pos-checkout',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pos-checkout.component.html',
  styleUrl: './pos-checkout.component.scss'
})
export class PosCheckoutComponent {
  /** INJECTS **/
  private salesService: SalesService = inject(SalesService);

  /** IO **/
  @Input() items: SaleItem[] = [];
  @Input() total: number = 0;
  @Output() clear = new EventEmitter<void>();

  /** VARIABLES **/
  paymentMethod: string = 'CASH';

  /** ADD SALE TO FIRESTORE **/
  async processSale(): Promise<void> {
    /** CHECK EMPTY CART **/
    if (this.items.length === 0) {
      console.error("El Carrito está vacio. No se puede procesar la venta.");
      return;
    }

    /** MAKE OBJECT SALE **/
    const sale: Sale = {
      items: this.items,
      total: this.total,
      paymentMethod: this.paymentMethod,
    }

    /**  SAVE SALE TO FIREBASE **/
    try {
      await this.salesService.addSale(sale);
      this.clear.emit();

    } catch (error) {
      console.error("NO SE PUDO REGISTRAR LA VENTA", error);
      throw error;
    }
  }
}
