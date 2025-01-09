import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {PurchaseOrder} from '../../../interfaces/purchase-order';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {combineLatest, Observable} from 'rxjs';
import {RouterLink} from '@angular/router';
import {PurchasingService} from '../../../services/purchasing.service';
import {ProductsService} from '../../../../products/services/products.service';
import {map} from 'rxjs/operators';
import {UserService} from '../../../../users/services/user.service';
import {ToastService} from '../../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-purchasing-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    FormsModule,
  ],
  templateUrl: './purchasing-edit.component.html',
  styleUrl: './purchasing-edit.component.scss'
})
export class PurchasingEditComponent implements OnInit {
  /** IO **/
  @Output() editCancel = new EventEmitter<boolean>();
  @Output() template = new EventEmitter<string>();
  @Input() order: PurchaseOrder | null = null;

  /** INJECTS **/
  private productsService = inject(ProductsService);
  private purchasingService = inject(PurchasingService);
  private usersService = inject(UserService);
  private toastService = inject(ToastService);

  /** COLLECTIONS **/
  public enrichedOrder$: Observable<any> | null = null;

  /** VARIABLES **/
  public updatedStatus: string = "";
  public isStatusChanged: boolean = false;

  ngOnInit(): void {
    if (this.order) {
      /* Initialize the status with the current value of the purchase order */
      this.updatedStatus = this.order.status;
      /* Disable the 'Edit' button at startup */
      this.isStatusChanged = false;

      /* Convert products to an array if it is not */
      const orderProducts = Array.isArray(this.order.products)
        ? this.order.products
        : [this.order.products]; /* Convert the object to an array */

      this.enrichedOrder$ = combineLatest([
        this.productsService.getProducts(),
        this.purchasingService.getSuppliers(),
        this.usersService.getUsers(),
      ]).pipe(
        map(([products, suppliers, users]) => {
          /* Enrich the products of the order */
          const enrichedProducts = orderProducts.map(orderProduct => {
            const product = products.find(p => p.id === orderProduct.product_id);
            return {
              ...orderProduct,
              product_name: product?.name || 'Producto desconocido',
              product_description: product?.description || 'Sin descripción',
            };
          });

          /* Find the supplier */
          const supplier = suppliers.find(s => s.id === this.order!.supplier_id);

          /* Find the user who created the order */
          const user = users.find(u => u.id === this.order!.createdBy);

          /* Return the rich order */
          return {
            ...this.order,
            supplier_company: supplier?.company || 'EMPRESA',
            supplier_ruc: supplier?.ruc || 'RUC',
            supplier_name: supplier?.fullName || 'REPRESENTANTE',
            supplier_dni: supplier?.dni || 'DNI',
            supplier_phone: supplier?.phone || 'TELEFONO',
            supplier_email: supplier?.email || 'CORREO ELECTRONICO',
            created_by_name: user?.displayName || '--',
            products: enrichedProducts, /* Enriched products */
          };
        })
      );
    } else {
      console.warn('No se recibió una orden válida en el @Input()');
    }
  }

  onStatusChange(): void {
    /* We enable the button only if the state has changed */
    this.isStatusChanged = this.updatedStatus !== this.order?.status;
  }

  async onSaveStatus(): Promise<void> {
    if (this.order) {
      try {
        const order = {
          ...this.order,
          status: this.updatedStatus,
        };

        /* We call the service to save the update */
        await this.purchasingService.updatePurchaseOrderStatus(this.order.id, order);
        this.toastService.showSuccess("EXITO! Orden editada correctamente.");

        /* We disable the button after saving */
        this.isStatusChanged = false;
      } catch (e) {
        this.toastService.showError(`ERROR! al actualizar la orden de compra. ${e}`);
        console.error('Error al actualizar la orden:', e);
      }
    }
  }

  getTemplate(template: string) {
    this.template.emit(template);
  }

  getCancel(value: boolean): void {
    this.editCancel.emit(value);
  }
}
