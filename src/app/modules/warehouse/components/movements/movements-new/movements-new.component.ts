import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../../../shared/toast/services/toast.service';
import {WarehouseService} from '../../../services/warehouse.service';
import {ProductsService} from '../../../../products/services/products.service';
import {Product} from '../../../../products/interfaces/product';
import {RouterLink} from '@angular/router';
import {combineLatest, Observable, startWith} from 'rxjs';
import {AsyncPipe, NgIf, SlicePipe} from '@angular/common';
import {
  ProductsCategoryByIdComponent
} from '../../../../products/components/categories/products-category-by-id/products-category-by-id.component';
import {map} from 'rxjs/operators';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {doc, Firestore, getDoc} from '@angular/fire/firestore';


@Component({
  selector: 'app-movements-new',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AsyncPipe, ProductsCategoryByIdComponent, SlicePipe, NgbPagination, NgIf],
  templateUrl: './movements-new.component.html',
  styleUrl: './movements-new.component.scss'
})
export class MovementsNewComponent implements OnInit {
  /** IO **/
  @Output() newCancel = new EventEmitter<boolean>();
  @Output() template = new EventEmitter<string>();

  /** INJECT **/
  private firestore = inject(Firestore);
  private fb = inject(FormBuilder);
  private warehouseService = inject(WarehouseService);
  private toastService = inject(ToastService);
  private productService = inject(ProductsService);

  /** VARIABLES **/
  searchControl = new FormControl();
  page: number = 1;
  pageSize: number = 8;
  selectedProductName: string = '';
  public showPriceInput: boolean = true;

  /** COLLECTIONS **/
  public listProducts$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]> | undefined;

  /** FORM **/
  public newForm: FormGroup;

  constructor() {
    this.newForm = this.fb.group({
      product_id: ['', [Validators.required]],
      type: ['INGRESO', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      price_cost: [0],
    });

    this.listProducts$ = this.productService.getProducts();
    this.onTypeChange();
  }

  ngOnInit(): void {
    this.filteredProducts$ = combineLatest([
      this.listProducts$,
      this.searchControl.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([products, searchTerm]) =>
        products.filter(product =>
          this.matchesSearch(product, searchTerm))
      ),
      map(filteredProducts => {
        return filteredProducts;
      })
    );
    setTimeout(() => document.getElementById('searchInput')?.focus(), 0);
  }

  onTypeChange() {
    const movementType = this.newForm.get('type')?.value;
    this.showPriceInput = movementType === 'INGRESO';
  }

  selectProduct(product: Product) {
    this.newForm.patchValue({
      product_id: product.id,
    });
    this.selectedProductName = product.name;
  }

  private matchesSearch(product: Product, searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.description.toLowerCase().includes(term.toLowerCase()) ||
      product.barCode.toLowerCase().includes(term.toLowerCase())
    );
  }

  getCancel(value: boolean) {
    this.newCancel.emit(value);
  }

  getTemplate(template: string) {
    this.template.emit(template);
  }

  async onSubmit(): Promise<void> {
    if (this.newForm.valid) {
      const movement = this.newForm.value;
      try {
        await this.warehouseService.addMovement(movement);
        await this.updateInventory(movement.product_id, movement.type, movement.quantity, movement.price_cost);
        this.toastService.showSuccess("Movimiento registrado con EXITO");
        this.newForm.reset();
        this.template.emit("LIST");

      } catch (e) {
        this.toastService.showError(`ERROR! al registrar el movimiento. ${e}`);
        console.error(e);
      }
    } else {
      this.toastService.showError("POR FAVOR! completa todos los campos del formulario.");
      return;
    }
  }

  private async updateInventory(productId: string, type: 'INGRESO' | 'SALIDA', quantity: number, price_cost: number) {
    const inventoryRef = doc(this.firestore, `warehouseInventory/${productId}`);
    const inventorySnapshot = await getDoc(inventoryRef);
    const inventoryData = inventorySnapshot.data() as any;

    if (!inventorySnapshot.exists()) {
      if (type === 'SALIDA') {
        throw new Error("No puedes realizar un movimiento sin stock.");
      }
      await this.warehouseService.addInventory(productId, quantity, price_cost);
    } else {

      await this.warehouseService.updateMovementInventory(productId, type, quantity, price_cost, inventoryData);
    }
  }

}
