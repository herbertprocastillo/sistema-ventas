import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Sale, SaleItem} from '../../../../sales/interfaces/sale';
import {SalesService} from '../../../../sales/services/sales.service';
import {NgIf} from '@angular/common';
import {ToastService} from '../../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-pos-checkout',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './pos-checkout.component.html',
  styleUrl: './pos-checkout.component.scss'
})
export class PosCheckoutComponent {
  /** IO **/
  @Input() items: SaleItem[] = [];
  @Input() total: number = 0;
  @Output() clear = new EventEmitter<void>();

  /** INJECTS **/
  private salesService: SalesService = inject(SalesService);
  private toastService: ToastService = inject(ToastService);

  /** VARIABLES **/
  public paymentMethod: string = "EFECTIVO";
  public cashReceived: number | null = null;
  public cashChange: number = 0;

  onPaymentMethodChange(): void {
    if (this.paymentMethod !== "EFECTIVO") {
      this.cashReceived = null;
      this.cashChange = 0;
    }
  }

  calculateChange(): void {
    if (this.cashReceived !== null && this.cashReceived >= this.total) {
      this.cashChange = this.cashReceived - this.total;
    } else {
      this.cashChange = 0;
    }
  }

  async addSale(): Promise<void> {
    if (this.items.length === 0) {
      this.toastService.showError("ERROR! El Carrito está vacio. No se puede procesar la venta.");
      console.error("El Carrito está vacio. No se puede procesar la venta.");
      return;
    }

    if (this.paymentMethod === 'EFECTIVO' && (this.cashReceived === null || this.cashReceived < this.total)) {
      console.error('El monto recibido no es suficiente para completar la venta.');
      return;
    }
    const sale: Sale = {
      items: this.items,
      total: this.total,
      paymentMethod: this.paymentMethod,
    };

    if (this.paymentMethod === 'EFECTIVO') {
      sale.cashReceived = this.cashReceived ?? 0;
      sale.cashChange = this.cashChange ?? 0;
    }

    try {
      await this.salesService.addSale(sale);
      this.cashReceived = null;
      this.cashChange = 0;
      this.clear.emit();
      this.toastService.showSuccess("EXITO! Venta realizado correctamente.");

    } catch (e) {
      this.toastService.showError("ERROR! No se puede procesar la venta.");
      console.error("No se puede procesar la venta", e);
      throw e;
    }
  }
}
