import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe, NgForOf} from '@angular/common';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ProductInfoComponent} from '../../../products/components/product-info/product-info.component';
import {Inventory} from '../../interfaces/warehouse';
import {WarehouseService} from '../../services/warehouse.service';
import {Subject, takeUntil} from 'rxjs';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    NgbPagination,
    ProductInfoComponent,
    RouterLink,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit, OnDestroy {
  /** INJECTS **/
  private fb = inject(FormBuilder);
  private warehouseService = inject(WarehouseService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  /** COLLECTIONS **/
  public listInventories: Inventory[] = [];

  /** FORM **/
  public editForm: FormGroup = this.fb.group({
    price_sale: [0, [Validators.required, Validators.min(0)]],
  });

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;
  public selectedInventory: Inventory | null = null;

  /** SUBSCRIPTION **/
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.page = 1;
    this.pageSize = 10;
    this.warehouseService.getInventory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Inventory[]) => {
          this.listInventories = [...data];
        },
        error: (e) => console.log("ERROR: ", e)
      });
  }

  get paginatedList(): Inventory[] {
    const start = (this.page - 1) * this.pageSize;
    const end = this.page * this.pageSize;
    return this.listInventories.slice(start, end);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
