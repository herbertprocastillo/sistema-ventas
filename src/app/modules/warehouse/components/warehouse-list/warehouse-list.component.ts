import {Component, EventEmitter, inject, Output} from '@angular/core';
import {Warehouse} from '../../interfaces/warehouse';
import {Observable} from 'rxjs';
import {WarehouseService} from '../../services/warehouse.service';
import {AsyncPipe, DatePipe, SlicePipe} from '@angular/common';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {UsersByIdComponent} from '../../../users/components/users-by-id/users-by-id.component';
import {ToastService} from '../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [
    AsyncPipe,
    NgbPagination,
    SlicePipe,
    DatePipe,
    UsersByIdComponent
  ],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.scss'
})
export class WarehouseListComponent {
  /** IO **/
  @Output() warehouse = new EventEmitter<Warehouse>();
  /** INJECTS **/
  private warehouseService = inject(WarehouseService);
  private toastService = inject(ToastService);
  private modalService = inject(NgbModal);
  /** COLLECTIONS **/
  warehouses$: Observable<Warehouse[]>;
  /** VARIABLES **/
  page: number = 1;
  pageSize: number = 10;

  constructor() {
    this.warehouses$ = this.warehouseService.getWarehouses();
  }

  /** EDIT WAREHOUSE **/
  getEditWarehouse(warehouse: Warehouse) {
    this.warehouse.emit(warehouse);
  }

  /** DELETE MODAL **/
  async openDeleteModal(content: any, warehouseId: string | undefined): Promise<void> {
    if (!warehouseId) {
      this.toastService.showError("El ID del almacen no es valido.");
      return;
    }
    try {
      const modalRef = this.modalService.open(content, {backdrop: 'static'});
      const result = await modalRef.result;
      if (result === "confirm") {
        await this.deleteWarehouse(warehouseId);
      }
    } catch (e) {
      console.error(`ERROR! Modal cerrado sin confirmacion. ${e}`);
    }
  }

  /** DELETE WAREHOUSE **/
  async deleteWarehouse(id: string): Promise<void> {
    this.warehouseService.isWarehouseInUse(id).subscribe(isInUse => {
      if (isInUse) {
        this.toastService.showError(`ERROR! No se puede eliminar este almacen porque contiene productos con stock.`);
      } else {
        try {
          this.warehouseService.deleteWarehouse(id);
          this.toastService.showSuccess("Almacen eliminado exitosamente.");

        } catch (e) {
          this.toastService.showError(`ERROR! al eliminar el almacen. ${e}`);
        }
      }
    });
  }
}
