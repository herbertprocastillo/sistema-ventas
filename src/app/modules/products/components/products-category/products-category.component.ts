import {Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from '@angular/router';
import {ProductsNavbarComponent} from '../products-navbar/products-navbar.component';
import {Category} from '../../interfaces/product';
import {ProductsCategoryEditComponent} from '../products-category-edit/products-category-edit.component';
import {ProductsCategoryNewComponent} from '../products-category-new/products-category-new.component';
import {ProductsCategoryListComponent} from '../products-category-list/products-category-list.component';

@Component({
  selector: 'app-products-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ProductsNavbarComponent,
    ProductsCategoryEditComponent,
    ProductsCategoryNewComponent,
    ProductsCategoryListComponent
  ],
  templateUrl: './products-category.component.html',
  styleUrl: './products-category.component.scss'
})
export class ProductsCategoryComponent {
  /** VARIABLES **/
  public editCategory: Category | null = null;

  getEditCategory(category: Category) {
    this.editCategory = category;
  }

  getCancel(cancel: boolean): void {
    if (cancel) {
      this.editCategory = null;
    }
  }
}
