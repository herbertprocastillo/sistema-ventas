import {Component, inject, OnInit} from '@angular/core';
import {PosNavbarComponent} from './pos-navbar/pos-navbar.component';
import {PosProductsComponent} from './pos-products/pos-products.component';
import {PosCartComponent} from './pos-cart/pos-cart.component';
import {PosCheckoutComponent} from './pos-checkout/pos-checkout.component';
import {PosSale} from '../../../products/interfaces/product';
import {SaleItem} from '../../../sales/interfaces/sale';

import {Field} from '../../../fields/interfaces/field';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {AuthService} from '../../../auth/services/auth.service';
import {PosService} from '../../services/pos.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [PosNavbarComponent, PosProductsComponent, PosCartComponent, PosCheckoutComponent],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent implements OnInit {
  /** INJECTS **/
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private posService = inject(PosService);
  private router = inject(Router);

  /** COLLECTIONS **/
  public cartItems: SaleItem[] = [];

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (user) {
      this.posService.getOpenCashRegisterByUser(user.uid)
        .subscribe(cashRegister => {
          if (!cashRegister) {
            this.router.navigate(['pos/cashRegister']);
          }
        })
    }
  }

  /** ADD NEW PRODUCT TO SHOPPING CART **/
  addToCart(product: PosSale): void {
    const existingItemIndex: number = this.cartItems.findIndex((item: SaleItem) => item.product_id === product.id);
    /** get information stock from product (product: PosSale) **/
    const availableStock: number = product.stock;
    /** product already exists at shopping cart **/
    if (existingItemIndex > -1) {
      const currentQuantity: number = this.cartItems[existingItemIndex].quantity;
      /** check if the quantity in the cart is greater than stock **/
      if (currentQuantity + 1 > availableStock) {
        console.warn(`No hay suficiente stock para ${product.name}.`);
        this.toastService.showError(`ERROR! El stock es insuficiente para ${product.name}.`);
        return; /** Do not allow adding more to the shopping cart **/
      }
      this.cartItems[existingItemIndex].quantity++;
      this.cartItems[existingItemIndex].subtotal = this.cartItems[existingItemIndex].quantity * this.cartItems[existingItemIndex].price_sale;
    } else {
      /** add new product in the shopping cart **/
      /** check if available stock is greater than 1 **/
      if (availableStock < 1) {
        console.warn(`El producto ${product.name} esta agotado.`);
        this.toastService.showError(`ERROR! El producto ${product.name} esta agotado.`);
        return; /** /** Do not allow adding to the shopping cart **/
      }
      /** The spread operator (...this.cartItems) is used to keep the existing items in cartItems and add the new product **/
      this.cartItems = [
        ...this.cartItems,
        {
          product_id: product.id!,
          product_name: product.name,
          availableStock: availableStock,
          quantity: 1,
          price_sale: product.price_sale,
          subtotal: product.price_sale,
        },
      ];
    }
  }

  /** ADD FIELD TO RENT **/
  addToRent(field: Field): void {

  }

  /** DELETE PRODUCTS FROM CART **/
  removeFromCart(item: SaleItem): void {
    this.cartItems = this.cartItems.filter(i => i.product_id !== item.product_id);
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
