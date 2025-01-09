import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe, CurrencyPipe, DatePipe, NgForOf} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {Supplier} from '../../../interfaces/purchase-order';
import {Product} from '../../../../products/interfaces/product';
import {PurchasingService} from '../../../services/purchasing.service';
import {Observable} from 'rxjs';
import {ProductsService} from '../../../../products/services/products.service';
import {ToastService} from '../../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-purchasing-new',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    CurrencyPipe,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './purchasing-new.component.html',
  styleUrl: './purchasing-new.component.scss'
})
export class PurchasingNewComponent implements OnInit {
  /** IO **/
  @Output() newCancel = new EventEmitter<boolean>();
  @Output() template = new EventEmitter<string>();

  /** COLLECTIONS **/
  public listSuppliers$: Observable<Supplier[]>;
  public listProducts$: Observable<Product[]>;

  /** FORMS **/
  public newForm: FormGroup;

  /** VARIABLES **/
  public purchaseOrderNumber: string = "";
  public today = new Date();

  constructor(
    private fb: FormBuilder,
    private purchasingService: PurchasingService,
    private productsServices: ProductsService,
    private toastService: ToastService
  ) {
    this.listSuppliers$ = this.purchasingService.getSuppliers();
    this.listProducts$ = this.productsServices.getProducts();
    this.newForm = this.fb.group({
      supplier_id: ['', [Validators.required]],
      products: this.fb.array([]),
      comments: [''],
    });
  }

  async ngOnInit() {
    try {
      this.purchaseOrderNumber = await this.purchasingService.getCurrentOrderNumber();
    } catch (e) {
      console.error("Error al obtener el numero de orden:", e);
    }
  }

  get productForms() {
    return this.newForm.get('products') as FormArray;
  }

  addProduct() {
    const productGroup = this.fb.group({
      product_id: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      subTotal: [0],
    });
    this.productForms.push(productGroup);
    this.updateSubTotal(this.productForms.length - 1);
  }

  removeProduct(index: number) {
    this.productForms.removeAt(index);
  }

  calculateTotal(): number {
    return this.productForms.value.reduce((acc: number, curr: {
      quantity: number;
      unitPrice: number;
    }) => acc + curr.quantity * curr.unitPrice, 0);
  }

  updateSubTotal(index: number) {
    const productGroup = this.productForms.at(index) as FormGroup;
    const quantity = productGroup.get('quantity')?.value || 0;
    const unitPrice = productGroup.get('unitPrice')?.value || 0;
    productGroup.get('subTotal')?.setValue(quantity * unitPrice);
  }

  clearProducts() {
    /* Get the FormArray */
    const productArray = this.productForms;

    while (productArray.length !== 0) {
      /* Remove items one by one */
      productArray.removeAt(0);
    }
  }

  async onSubmit() {
    console.log(this.newForm.value);
    if (this.newForm.valid) {
      try {
        /* Get the next consecutive number */
        const orderNumber = await this.purchasingService.getNextOrderNumber();

        /* Prepare order data */
        const order = {
          ...this.newForm.value,
          orderNumber, // Correlative number
          total: this.calculateTotal(),
          status: "COMPLETA",
        };

        await this.purchasingService.addPurchaseOrder(order);
        this.toastService.showSuccess("EXITO! Orden registrada correctamente.");
        this.newForm.reset();
        this.clearProducts();
        console.log('Orden registrada con número:', orderNumber);
        this.purchaseOrderNumber = await this.purchasingService.getCurrentOrderNumber();

      } catch (e) {
        this.toastService.showError(`ERROR! al registrar la orden de compra. ${e}`);
        console.error('Error al registrar la orden:', e);
        throw e;
      }
    }
  }

  getTemplate(template: string): void {
    this.template.emit(template);
  }

  getCancel(value: boolean): void {
    this.newCancel.emit(value);
  }
}
