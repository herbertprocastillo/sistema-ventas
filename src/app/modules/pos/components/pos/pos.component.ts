import {Component} from '@angular/core';
import {PosNavbarComponent} from '../pos-navbar/pos-navbar.component';
import {RouterLink} from '@angular/router';
import {PosProductsComponent} from '../pos-products/pos-products.component';
import {PosCartComponent} from '../pos-cart/pos-cart.component';
import {PosCheckoutComponent} from '../pos-checkout/pos-checkout.component';
import {Product} from '../../../products/interfaces/product';
import {SaleItem} from '../../../sales/interfaces/sale';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    PosNavbarComponent,
    RouterLink,
    PosProductsComponent,
    PosCartComponent,
    PosCheckoutComponent
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent {
  cartItems: SaleItem[] = [];

  /** ADD PRODUCTS TO CART **/
  addToCart(product: Product): void {
    // Buscar si el producto ya existe en el carrito
    const existingItemIndex = this.cartItems.findIndex(item => item.productId === product.id);

    if (existingItemIndex > -1) {
      // Si ya existe, incrementar la cantidad y actualizar el subtotal
      this.cartItems[existingItemIndex].quantity++;
      this.cartItems[existingItemIndex].subtotal =
        this.cartItems[existingItemIndex].quantity * this.cartItems[existingItemIndex].price;
    } else {
      // Si no existe, agregar el producto como un nuevo item
      this.cartItems = [
        ...this.cartItems, // Crear un nuevo arreglo para forzar la detección de cambios
        {
          productId: product.id!,
          productName: product.name,
          quantity: 1,
          price: product.price,
          subtotal: product.price,
        },
      ];
    }
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
