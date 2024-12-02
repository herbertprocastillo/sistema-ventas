import {Component, inject, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Category} from '../../interfaces/product';
import {ProductsService} from '../../services/products.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {CategoriesService} from '../../services/categories.service';

@Component({
  selector: 'app-products-category-by-id',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './products-category-by-id.component.html',
  styleUrl: './products-category-by-id.component.scss'
})
export class ProductsCategoryByIdComponent implements OnInit {
  /** IO **/
  @Input() categoryId: string | undefined;

  /** injects **/
  private productService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);

  /** variables **/
  category$: Observable<Category> | undefined;

  ngOnInit(): void {
    if (this.categoryId) {
      this.category$ = this.categoriesService.getCategoryById(this.categoryId);
    }
  }
}
