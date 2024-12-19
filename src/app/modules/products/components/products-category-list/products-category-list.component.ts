import {Component, EventEmitter, inject, Output} from '@angular/core';
import {AsyncPipe, DatePipe, SlicePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModal, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {UsersByIdComponent} from "../../../users/components/users-by-id/users-by-id.component";
import {Category} from '../../interfaces/product';
import {Observable} from 'rxjs';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {ProductsService} from '../../services/products.service';

@Component({
  selector: 'app-products-category-list',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    NgbPagination,
    ReactiveFormsModule,
    SlicePipe,
    UsersByIdComponent
  ],
  templateUrl: './products-category-list.component.html',
  styleUrl: './products-category-list.component.scss'
})
export class ProductsCategoryListComponent {
  /** IO **/
  @Output() editCategory = new EventEmitter<Category>();
  /** INJECTS **/
  private productsService = inject(ProductsService);
  private toastService = inject(ToastService);
  private modalService = inject(NgbModal);
  /** COLLECTIONS **/
  public categories$: Observable<Category[]>;
  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;

  constructor() {
    this.categories$ = this.productsService.getCategories();
  }

  /** EDIT CATEGORY **/
  getEditCategory(category: Category) {
    this.editCategory.emit(category);
  }

  /** DELETE MODAL **/
  async openDeleteModal(content: any, categoryId: string): Promise<void> {
    if (!categoryId) {
      this.toastService.showError("El ID de la categoria no es valido.");
      return;
    }
    try {
      const modalRef = this.modalService.open(content, {backdrop: 'static'});
      const result = await modalRef.result;
      if (result === "confirm") {
        await this.deleteCategory(categoryId);
      }
    } catch (e) {
      console.error(`ERROR! Modal cerrado sin confirmacion. ${e}`);
    }
  }

  /** DELETE CATEGORY **/
  async deleteCategory(id: string): Promise<void> {
    this.productsService.isCategoryInUse(id).subscribe(isInUse => {
      if (isInUse) {
        this.toastService.showError(`ERROR! No se puede eliminar esta categoria porque esta en uso.`);
      } else {

        try {
          this.productsService.deleteCategory(id);
          this.toastService.showSuccess("Categoria eliminada exitosamente.");

        } catch (e) {
          this.toastService.showError(`ERROR! al eliminar la categoria. ${e}`);
        }
      }
    });
  }
}
