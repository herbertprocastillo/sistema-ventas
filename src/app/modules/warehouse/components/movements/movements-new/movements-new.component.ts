import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../../../shared/toast/services/toast.service';
import {WarehouseService} from '../../../services/warehouse.service';
import {ProductsService} from '../../../../products/services/products.service';
import {Category, Product} from '../../../../products/interfaces/product';
import {RouterLink} from '@angular/router';
import {BehaviorSubject, combineLatest, Observable, startWith} from 'rxjs';
import {AsyncPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {map} from 'rxjs/operators';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {doc, Firestore, getDoc} from '@angular/fire/firestore';

@Component({
  selector: 'app-movements-new',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AsyncPipe, SlicePipe, NgbPagination, NgIf, NgForOf],
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
  private productsService = inject(ProductsService);

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;
  public selectedProductName: string = '';
  public showPriceInput: boolean = true;

  /** COLLECTIONS **/
  public listCategories$: Observable<Category[]> = this.productsService.getCategories();
  public listProducts$: Observable<Product[]> = this.productsService.getProducts();
  public filteredProducts$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  /** FORM **/
  public newForm: FormGroup = this.fb.group({
    product_id: ['', [Validators.required]],
    type: ['INGRESO', [Validators.required]],
    quantity: [0, [Validators.required, Validators.min(1)]],
    price: [0],
  });
  public searchControl = new FormControl();
  public categoryControl = new FormControl('TODAS');

  ngOnInit(): void {
    this.onTypeChange();
    combineLatest([
      this.listProducts$,
      this.listCategories$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.categoryControl.valueChanges.pipe(startWith('TODAS'))
    ]).pipe(
      map(([products, categories, searchTerm, selectedCategory]) => {
        const mappedProducts = products.map(product => {
          const category = categories.find(cat => cat.id === product.category_id);
          return {
            ...product,
            category_name: category ? category.name : 'Sin categoría',
          };
        });
        return mappedProducts.filter(product =>
          this.matchesSearch(product, searchTerm) &&
          this.matchesCategory(product.category_id, selectedCategory)
        );
      })
    ).subscribe((filterData) => {
      this.filteredProducts$.next(filterData);
    });

    setTimeout(() => document.getElementById('searchInput')?.focus(), 0);
  }

  /** FILTER PRODUCTS FROM PRODUCTS **/
  private matchesSearch(product: Product, searchTerm: string): boolean {
    const term: string = searchTerm?.trim().toLowerCase() || '';
    return (
      (product.name?.includes(term) || false) ||
      (product.description?.includes(term) || false) ||
      (product.barCode?.includes(term) || false)
    );
  }

  /** FILTER CATEGORY FROM PRODUCTS **/
  private matchesCategory(id: string, selectedCategory: string | null): boolean {
    return !selectedCategory || selectedCategory === 'TODAS' || id === selectedCategory;
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
        await this.updateInventory(movement.product_id, movement.type, movement.quantity, movement.price);
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

  private async updateInventory(productId: string, type: 'INGRESO' | 'SALIDA', quantity: number, price: number) {
    const inventoryRef = doc(this.firestore, `warehouseInventory/${productId}`);
    const inventorySnapshot = await getDoc(inventoryRef);
    const inventoryData = inventorySnapshot.data() as any;

    if (!inventorySnapshot.exists()) {
      if (type === 'SALIDA') {
        throw new Error("No puedes realizar un movimiento sin stock.");
      }
      await this.warehouseService.addInventory(productId, quantity, price);
    } else {

      await this.warehouseService.updateMovementInventory(productId, type, quantity, price, inventoryData);
    }
  }

}
