import {Component, EventEmitter, inject, Output} from '@angular/core';
import {AsyncPipe, CurrencyPipe, DatePipe, NgIf, NgStyle, SlicePipe} from '@angular/common';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ProductInfoComponent} from '../../../../products/components/product-info/product-info.component';
import {UsersByIdComponent} from '../../../../users/components/users-by-id/users-by-id.component';
import {Movement} from '../../../interfaces/warehouse';
import {Observable} from 'rxjs';
import {WarehouseService} from '../../../services/warehouse.service';
import {RouterLink} from '@angular/router';
import {ToastService} from '../../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-movements-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgbPagination,
    ProductInfoComponent,
    SlicePipe,
    UsersByIdComponent,
    NgStyle,
    AsyncPipe,
    RouterLink,
    NgIf
  ],
  templateUrl: './movements-list.component.html',
  styleUrl: './movements-list.component.scss'
})
export class MovementsListComponent {
  /** IO **/
  @Output() editMovement = new EventEmitter<Movement>();
  @Output() template = new EventEmitter<string>();
  /** INJECTS **/
  private warehouseService = inject(WarehouseService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  /** COLLECTIONS **/
  public listMovements$: Observable<Movement[]>;
  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;

  constructor() {
    this.listMovements$ = this.warehouseService.getMovements();
  }

  getTemplate(template: string) {
    this.template.emit(template);
  }

  getEdit(movement: Movement): void {
    this.editMovement.emit(movement);
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
