import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {AsyncPipe, CurrencyPipe, DatePipe, NgIf, NgStyle, SlicePipe} from '@angular/common';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Movement} from '../../../interfaces/warehouse';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {WarehouseService} from '../../../services/warehouse.service';
import {RouterLink} from '@angular/router';
import {ToastService} from '../../../../../shared/toast/services/toast.service';
import {ReactiveFormsModule} from '@angular/forms';
import {MovementsExportComponent} from '../movements-export/movements-export.component';
import {UserService} from '../../../../users/services/user.service';
import {ProductsService} from '../../../../products/services/products.service';
import {User as AppUser} from '../../../../users/interfaces/user';
import {Product} from '../../../../products/interfaces/product';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-movements-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgbPagination,
    SlicePipe,
    NgStyle,
    AsyncPipe,
    RouterLink,
    NgIf,
    ReactiveFormsModule,
    MovementsExportComponent
  ],
  templateUrl: './movements-list.component.html',
  styleUrl: './movements-list.component.scss'
})
export class MovementsListComponent implements OnInit {
  /** IO **/
  @Output() template = new EventEmitter<string>();

  /** INJECTS **/
  private usersService = inject(UserService);
  private productsService = inject(ProductsService);
  private warehouseService = inject(WarehouseService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  /** COLLECTIONS **/
  public listUsers$: Observable<AppUser[]> = this.usersService.getUsers();
  public listProducts$: Observable<Product[]> = this.productsService.getProducts();
  public listMovements$: Observable<Movement[]> = this.warehouseService.getMovements();
  public filteredMovements$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;

  ngOnInit(): void {
    combineLatest([
      this.listMovements$,
      this.listProducts$,
      this.listUsers$,
    ]).pipe(
      map(([movements, products, users]) => {
        return movements.map(movement => {
          const product = products.find(pro => pro.id === movement.product_id);
          const createdBy = users.find(user => user.id === movement.createdBy);
          const updatedBy = users.find(user => user.id === movement.updatedBy);
          return {
            ...movement,
            product_name: product ? product.name : '--',
            created_by_name: createdBy ? createdBy.displayName : '--',
            updated_by_name: updatedBy ? updatedBy.displayName : '--',
          };
        });
      })
    ).subscribe((filterData) => {
      this.filteredMovements$.next(filterData);
    });

    setTimeout(() => document.getElementById('searchInput')?.focus(), 0);
  }


  getTemplate(template: string) {
    this.template.emit(template);
  }

  /*********************
   ** DELETE MOVEMENT **
   *********************/
  async openDeleteModal(content: any, movementId: string | undefined): Promise<void> {
    if (!movementId) {
      this.toastService.showError('El ID del movimiento no es válido.');
      return;
    }
    try {
      const modalRef = this.modalService.open(content, {backdrop: 'static'});
      const result = await modalRef.result;
      if (result === 'confirm') {
        await this.deleteMovement(movementId);
      }
    } catch (error) {
      console.log('Modal cerrado sin confirmación', error);
    }
  }

  async deleteMovement(movementId: string): Promise<void> {
    try {
      await this.warehouseService.deleteMovement(movementId);
      this.toastService.showSuccess('Movimiento eliminado con éxito');
    } catch (e) {
      this.toastService.showError(`Error al eliminar el movimiento: ${e}`);
    }
  }
}
