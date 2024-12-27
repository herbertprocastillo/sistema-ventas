import {Component, inject, OnInit} from '@angular/core';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Inventory} from '../../interfaces/warehouse';
import {WarehouseService} from '../../services/warehouse.service';
import {BehaviorSubject, combineLatest, Observable, startWith} from 'rxjs';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {Category, Product} from '../../../products/interfaces/product';
import {ProductsService} from '../../../products/services/products.service';
import {map} from 'rxjs/operators';
import {AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgForOf, SlicePipe} from '@angular/common';
import {InventoryExportComponent} from './inventory-export/inventory-export.component';
import {WarehouseNavbarComponent} from '../warehouse-navbar/warehouse-navbar.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
    NgbPagination,
    NgForOf,
    SlicePipe,
    InventoryExportComponent,
    WarehouseNavbarComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  /** INJECTS **/
  private fb = inject(FormBuilder);
  private warehouseService = inject(WarehouseService);
  private productsService = inject(ProductsService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  /** COLLECTIONS **/
  public listProducts$: Observable<Product[]> = this.productsService.getProducts();
  public listCategories$: Observable<Category[]> = this.productsService.getCategories();
  public listInventories$: Observable<Inventory[]> = this.warehouseService.getInventory();
  public filteredInventories$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  /** FORM **/
  public searchControl = new FormControl();
  public categoryControl = new FormControl('TODAS');
  public editForm: FormGroup = this.fb.group({
    price_sale: [0, [Validators.required, Validators.min(0)]],
    price_cost: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required]],
  });

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 8;
  public selectedInventory: Inventory | null = null;

  ngOnInit(): void {
    combineLatest([
      this.listInventories$,
      this.listProducts$,
      this.listCategories$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.categoryControl.valueChanges.pipe(startWith('TODAS'))
    ]).pipe(
      map(([inventories, products, categories, searchTerm, selectedCategory]) => {
        const mappedInventories = inventories.map((inventory: Inventory) => {
          const product = products.find((p) => p.id === inventory.product_id);
          const category = categories.find((c) => c.id === product?.category_id);
          return {
            ...inventory,
            category_name: category ? category.name : 'Sin categoría',
            product_name: product ? product.name : 'Sin nombre',
            product_category_id: product ? product.category_id : '',
            product_description: product ? product.description : 'Sin descripción',
            product_image: product ? product.imageUrl : 'Sin imagen',
            product_barCode: product ? product.barCode : '',
          };
        });
        return mappedInventories.filter(inventory =>
          this.matchesSearch(inventory, searchTerm) &&
          this.matchesCategory(inventory.product_category_id, selectedCategory)
        );
      })
    ).subscribe((filterData) => {
      this.filteredInventories$.next(filterData);
    });

    setTimeout(() => document.getElementById('searchInput')?.focus(), 0);
  }

  /** FILTER PRODUCTS FROM INVENTORY **/
  private matchesSearch(inventory: Inventory, searchTerm: string): boolean {
    const term: string = searchTerm?.trim().toLowerCase() || '';
    return (
      (inventory.product_name?.includes(term) || false) ||
      (inventory.product_description?.includes(term) || false) ||
      (inventory.product_barCode?.includes(term) || false)
    );
  }

  /** FILTER CATEGORY FROM INVENTORY **/
  private matchesCategory(id: string, selectedCategory: string | null): boolean {
    return !selectedCategory || selectedCategory === 'TODAS' || id === selectedCategory;
  }

  /** OPEN - UPDATE MODAL **/
  openEditModal(inventory: Inventory, modalTemplate: any) {
    this.selectedInventory = inventory;
    this.editForm.patchValue({
      price_sale: inventory.price_sale,
      price_cost: inventory.price_cost,
      stock: inventory.stock,
    });
    this.modalService.open(modalTemplate, {backdrop: 'static'});
  }

  /** UPDATE INVENTORY **/
  async updateInventory(modal: any) {

    if (this.editForm.invalid) {
      this.toastService.showError("ERROR!, Por favor rellena todos los datos.");
      return;
    }

    const newPriceSale = this.editForm.get('price_sale')?.value;
    const newPriceCost = this.editForm.get('price_cost')?.value;
    const newStock = this.editForm.get('stock')?.value;

    try {
      // @ts-ignore
      await this.warehouseService.updateInventory(this.selectedInventory?.id, newPriceSale, newPriceCost, newStock);
      modal.close();
      this.toastService.showSuccess("Precio actualizado exitosamente.");

    } catch (e) {
      console.error('ERROR! Al actualizar el precio de venta.', e);
      this.toastService.showError("ERROR! Al actualizar el precio de venta.");
    }
  }
}
