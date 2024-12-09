import {Component} from '@angular/core';
import {PosNavbarComponent} from '../pos-navbar/pos-navbar.component';
import {PosProductsComponent} from '../pos-products/pos-products.component';
import {PosCartComponent} from '../pos-cart/pos-cart.component';
import {PosCheckoutComponent} from '../pos-checkout/pos-checkout.component';
import {PosSale} from '../../../products/interfaces/product';
import {SaleItem} from '../../../sales/interfaces/sale';
import {PosRentComponent} from '../pos-rent/pos-rent.component';
import {Field} from '../../../fields/interfaces/field';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [PosNavbarComponent, PosProductsComponent, PosCartComponent, PosCheckoutComponent, PosRentComponent],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent {
  public cartItems: SaleItem[] = [];

  /** ADD PRODUCTS TO CART **/
  addToCart(product: PosSale): void {
    const existingItemIndex: number = this.cartItems.findIndex(item => item.productId === product.id);

    if (existingItemIndex > -1) {
      this.cartItems[existingItemIndex].quantity++;
      this.cartItems[existingItemIndex].subtotal = this.cartItems[existingItemIndex].quantity * this.cartItems[existingItemIndex].price;
    } else {
      this.cartItems = [...this.cartItems, {
        productId: product.id!,
        productName: product.name,
        quantity: 1,
        price: product.price_sale,
        subtotal: product.price_sale,
      },];
    }
  }
  /** ADD FIELD TO RENT **/
  addToRent(field: Field): void {

  }

  /** DELETE PRODUCTS FROM CART **/
  removeFromCart(item: SaleItem): void {
    this.cartItems = this.cartItems.filter(i => i.productId !== item.productId);
  }

  /** GET TOTAL AMOUNT FROM CART **/
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.subtotal, 0);
  }

  /** CLEAR CART AFTER SALE **/
  clearCart(): void {
    this.cartItems = [];
  }
}
