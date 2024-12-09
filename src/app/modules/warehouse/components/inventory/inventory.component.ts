import {Component, inject} from '@angular/core';
import {AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, SlicePipe} from '@angular/common';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ProductInfoComponent} from '../../../products/components/product-info/product-info.component';
import {Inventory} from '../../interfaces/warehouse';
import {WarehouseService} from '../../services/warehouse.service';
import {Observable} from 'rxjs';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    NgbPagination,
    ProductInfoComponent,
    SlicePipe,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  /** INJECTS **/
  private fb = inject(FormBuilder);
  private warehouseService = inject(WarehouseService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  /** COLLECTIONS **/
  public inventory$: Observable<Inventory[]> = this.warehouseService.getInventory();
  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;
  public selectedInventory: Inventory | null = null;
  public editForm: FormGroup;

  constructor() {
    this.editForm = this.fb.group({
      price_sale: [0, [Validators.required, Validators.min(0)]],
    });
  }


  /** UPDATE MODAL **/
  openEditModal(inventory: Inventory, modalTemplate: any) {
    this.selectedInventory = inventory;
    this.editForm.patchValue({
      price_sale: inventory.price_sale,
    });
    this.modalService.open(modalTemplate, {backdrop: 'static'});
  }

  /** UPDATE PRICE SALE **/
  async updatePrice(modal: any) {
    if (this.editForm.invalid) {
      this.toastService.showError("Por favor, ingresa un precio valido.");
      alert('Por favor, ingresa un precio válido.');
      return;
    }

    const newPrice = this.editForm.get('price_sale')?.value;

    try {
      // @ts-ignore
      await this.warehouseService.updateSalePrice(this.selectedInventory.id, newPrice);
      modal.close();
      this.toastService.showSuccess("Precio actualizado exitosamente.");

    } catch (e) {
      console.error('Error al actualizar el precio de venta:', e);
      this.toastService.showError("Error al actualizar el precio de venta.");
    }
  }
}
