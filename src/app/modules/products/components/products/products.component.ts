import {Component} from '@angular/core';
import {ProductsNavbarComponent} from '../products-navbar/products-navbar.component';
import {ProductsEditComponent} from '../products-edit/products-edit.component';
import {ProductsNewComponent} from '../products-new/products-new.component';
import {ProductsListComponent} from '../products-list/products-list.component';
import {Product} from '../../interfaces/product';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductsNavbarComponent,
    ProductsEditComponent,
    ProductsNewComponent,
    ProductsListComponent,
    RouterLink
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  /** VARIABLES **/
  public editProduct: Product | null = null;

  getEditProduct(product: Product) {
    this.editProduct = product;
  }

  getCancel(cancel: boolean): void {
    if (cancel) {
      this.editProduct = null;
    }
  }
}
