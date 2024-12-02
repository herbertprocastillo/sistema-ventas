import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {combineLatest, Observable, startWith} from 'rxjs';
import {Product, Category} from '../../interfaces/product';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {AsyncPipe, DatePipe, DecimalPipe, NgForOf, SlicePipe} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {map} from 'rxjs/operators';
import {UsersByIdComponent} from '../../../users/components/users-by-id/users-by-id.component';
import {ProductsCategoryByIdComponent} from '../products-category-by-id/products-category-by-id.component';

import {ProductsService} from '../../services/products.service';
import {CategoriesService} from '../../services/categories.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    NgbPagination,
    ReactiveFormsModule,
    SlicePipe,
    DecimalPipe,
    NgForOf,
    UsersByIdComponent,
    ProductsCategoryByIdComponent
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  /** IO **/
  @Output() product = new EventEmitter<Product>();

  /** injects **/
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);


  page: number = 1;
  pageSize: number = 10;

  searchControl = new FormControl();
  categoryControl = new FormControl('TODAS');

  public listProducts$: Observable<Product[]>;
  public listCategories$: Observable<Category[]>;
  filteredProducts$: Observable<Product[]> | undefined;

  constructor() {
    this.listProducts$ = this.productsService.getProducts();
    this.listCategories$ = this.categoriesService.getCategories();
  }

  ngOnInit(): void {
    this.filteredProducts$ = combineLatest([
      this.listProducts$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.categoryControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([products, searchTerm, selectedCategory]) =>
        products.filter(product =>
          this.matchesSearch(product, searchTerm) &&
          this.matchesCategory(product, selectedCategory)
        )
      ),
      map(filteredProducts => {
        return filteredProducts;
      })
    );
    setTimeout(() => document.getElementById('searchInput')?.focus(), 0);
  }

  private matchesSearch(product: Product, searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.description.toLowerCase().includes(term.toLowerCase()) ||
      product.barCode.toLowerCase().includes(term.toLowerCase())
    );
  }

  private matchesCategory(product: Product, selectedCategory: string | null): boolean {
    return !selectedCategory || selectedCategory === 'TODAS' || product.category_id === selectedCategory;
  }

  getEditProduct(product: Product): void {
    this.product.emit(product);
  }

  /********************
   ** DELETE PRODUCT **
   ********************/
  async openDeleteModal(content: any, productId: string | undefined): Promise<void> {
    if (!productId) {
      this.toastService.showError('El ID del producto no es válido.');
      return;
    }
    try {
      const modalRef = this.modalService.open(content, {backdrop: 'static'});
      const result = await modalRef.result;
      if (result === 'confirm') {
        await this.deleteProduct(productId);
      }
    } catch (error) {
      console.log('Modal cerrado sin confirmación', error);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.productsService.deleteProduct(productId);
      this.toastService.showSuccess('Producto eliminado con éxito');
    } catch (error) {
      this.toastService.showError(`Error al eliminar el producto: ${error}`);
    }
  }

  /*************************
   ** PREVIEW IMAGE MODAL **
   *************************/
  async openImageModal(content: any, imageUrl: string): Promise<void> {
    this.modalService.open(content, {size: 'lg', centered: true});
  }
}
