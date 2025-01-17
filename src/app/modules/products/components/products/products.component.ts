import {Component, inject, OnInit} from '@angular/core';
import {ProductsNavbarComponent} from './products-navbar/products-navbar.component';
import {ProductsEditComponent} from './products-edit/products-edit.component';
import {ProductsNewComponent} from './products-new/products-new.component';
import {Category, Product} from '../../interfaces/product';
import {RouterLink} from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, DatePipe, NgForOf, SlicePipe} from '@angular/common';
import {ProductsService} from '../../services/products.service';
import {BehaviorSubject, combineLatest, Observable, startWith} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from '../../../users/services/user.service';
import {User as AppUser} from '../../../users/interfaces/user';
import {ProductsExportComponent} from './products-export/products-export.component';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductsNavbarComponent,
    ProductsEditComponent,
    ProductsNewComponent,
    RouterLink,
    FormsModule,
    AsyncPipe,
    NgForOf,
    ReactiveFormsModule,
    ProductsExportComponent,
    DatePipe,
    NgbPagination,
    SlicePipe,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  /** INJECTS **/
  private usersService = inject(UserService);
  private productsService = inject(ProductsService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;
  public editProduct: Product | null = null;
  public searchControl = new FormControl();
  public categoryControl = new FormControl('TODAS');

  /** COLLECTIONS **/
  public listUsers$: Observable<AppUser[]> = this.usersService.getUsers();
  public listProducts$: Observable<Product[]> = this.productsService.getProducts();
  public listCategories$: Observable<Category[]> = this.productsService.getCategories();
  public filteredProducts$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  ngOnInit(): void {
    combineLatest([
      this.listProducts$,
      this.listCategories$,
      this.listUsers$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.categoryControl.valueChanges.pipe(startWith('TODAS'))
    ]).pipe(
      map(([products, categories, users, searchTerm, selectedCategory]) => {
        const mappedProducts = products.map(product => {
          const category = categories.find(cat => cat.id === product.category_id);
          const createdBy = users.find(user => user.id === product.createdBy);
          const updatedBy = users.find(user => user.id === product.updatedBy);
          return {
            ...product,
            category_name: category ? category.name : '--',
            created_by_name: createdBy ? createdBy.displayName : '--',
            updated_by_name: updatedBy ? updatedBy.displayName : '--',
          };
        });
        return mappedProducts.filter(product =>
          this.matchesSearch(product, searchTerm) &&
          this.matchesCategory(product.category_id, selectedCategory)
        );
      })
    ).subscribe((filterData) => {
      this.filteredProducts$.next(filterData);
    });

    setTimeout(() => document.getElementById('searchInput')?.focus(), 0);
  }

  /** FILTER PRODUCTS FROM PRODUCTS **/
  private matchesSearch(product: Product, searchTerm: string): boolean {
    const term: string = searchTerm?.trim().toLowerCase() || '';
    return (
      (product.name?.includes(term) || false) ||
      (product.description?.includes(term) || false) ||
      (product.barCode?.includes(term) || false)
    );
  }

  /** FILTER CATEGORY FROM PRODUCTS **/
  private matchesCategory(id: string, selectedCategory: string | null): boolean {
    return !selectedCategory || selectedCategory === 'TODAS' || id === selectedCategory;
  }

  getEditProduct(product: Product) {
    this.editProduct = product;
  }

  getCancel(cancel: boolean): void {
    if (cancel) {
      this.editProduct = null;
    }
  }

  /** OPEN MODAL DELETE **/
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

  /** DELETE PRODUCT **/
  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.productsService.deleteProduct(productId);
      this.toastService.showSuccess('Producto eliminado con éxito');
    } catch (error) {
      this.toastService.showError(`Error al eliminar el producto: ${error}`);
    }
  }

  /** PREVIEW IMAGE MODAL **/
  async openImageModal(content: any): Promise<void> {
    this.modalService.open(content, {size: 'lg', centered: true});
  }
}
