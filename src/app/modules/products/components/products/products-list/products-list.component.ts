import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {Product} from '../../../interfaces/product';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../../shared/toast/services/toast.service';
import {AsyncPipe, DatePipe, SlicePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductsService} from '../../../services/products.service';

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
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
  /** IO **/
  @Input() filteredProducts$: Observable<Product[]> | undefined;
  @Output() product = new EventEmitter<Product>();

  /** INJECTS **/
  private productsService = inject(ProductsService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;

  getEditProduct(product: Product): void {
    this.product.emit(product);
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
