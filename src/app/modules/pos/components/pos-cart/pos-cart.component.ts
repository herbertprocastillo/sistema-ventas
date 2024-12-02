import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from '@angular/common';
import {SaleItem} from '../../../sales/interfaces/sale';
import {Product} from '../../../products/interfaces/product';

@Component({
  selector: 'app-pos-cart',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './pos-cart.component.html',
  styleUrl: './pos-cart.component.scss'
})
export class PosCartComponent {
  @Input() items: SaleItem[] = [];
  @Output() removeItem = new EventEmitter<SaleItem>();

  onRemoveItem(item: SaleItem): void {
    this.removeItem.emit(item);
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + item.subtotal, 0);
  }
 /* @Input() items: SaleItem[] = [];

  addToCart(product: Product): void {
    const existingItem = this.items.find(item => item.productId === product.id);
    if (existingItem) {
      existingItem.quantity++;
      existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
      this.items.push({
        productId: product.id!,
        productName: product.name,
        quantity: 1,
        price: product.price,
        subtotal: product.price,
      });
    }
  }

  removeFromCart(item: SaleItem): void {
    this.items = this.items.filter(i => i.productId !== item.productId);
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + item.subtotal, 0);
  }*/
}
