import {Component, inject, OnInit} from '@angular/core';
import {ProductsNavbarComponent} from '../products/products-navbar/products-navbar.component';
import {RouterLink} from '@angular/router';
import {Category} from '../../interfaces/product';
import {CategoriesNewComponent} from './categories-new/categories-new.component';
import {CategoriesEditComponent} from './categories-edit/categories-edit.component';
import {UserService} from '../../../users/services/user.service';
import {ProductsService} from '../../services/products.service';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {User as AppUser} from '../../../users/interfaces/user';
import {map} from 'rxjs/operators';
import {AsyncPipe, DatePipe, SlicePipe} from '@angular/common';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    ProductsNavbarComponent,
    RouterLink,
    CategoriesNewComponent,
    CategoriesEditComponent,
    AsyncPipe,
    DatePipe,
    NgbPagination,
    SlicePipe
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  /** INJECTS **/
  private usersService = inject(UserService);
  private productsService = inject(ProductsService);
  private toastService = inject(ToastService);
  private modalService = inject(NgbModal);

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;
  public editCategory: Category | null = null;

  /** COLLECTIONS **/
  public listUsers$: Observable<AppUser[]> = this.usersService.getUsers();
  public listCategories$: Observable<Category[]> = this.productsService.getCategories();
  public filteredCategories$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  ngOnInit(): void {
    combineLatest([
      this.listCategories$,
      this.listUsers$,
    ]).pipe(
      map(([categories, users]) => {
        return categories.map(category => {
          const createdBy = users.find(user => user.id === category.createdBy);
          const updatedBy = users.find(user => user.id === category.updatedBy);
          return {
            ...category,
            created_by_name: createdBy ? createdBy.displayName : '--',
            updated_by_name: updatedBy ? updatedBy.displayName : '--',
          };
        });
      })
    ).subscribe((filterData) => {
      this.filteredCategories$.next(filterData);
    });
  }

  getEditCategory(category: Category) {
    this.editCategory = category;
  }

  getCancel(cancel: boolean): void {
    if (cancel) {
      this.editCategory = null;
    }
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
