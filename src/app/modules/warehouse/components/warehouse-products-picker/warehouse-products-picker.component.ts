import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, Observable, startWith, Subscription, switchMap} from 'rxjs';
import {Product} from '../../../products/interfaces/product';
import {ProductsService} from '../../../products/services/products.service';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-warehouse-products-picker',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './warehouse-products-picker.component.html',
  styleUrl: './warehouse-products-picker.component.scss'
})
export class WarehouseProductsPickerComponent {
  @Output() selectedProduct = new EventEmitter<Product>();
  public searchControl: FormControl = new FormControl('');
  public filteredProducts$: Observable<Product[]> | null = null;
  public showResults: boolean = false;
  public productPicked: Product | null = null;

  constructor(private productsService: ProductsService) {
    this.filteredProducts$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((searchTerm: string) => searchTerm.trim().length > 0),
      switchMap((searchTerm: string) =>
        this.productsService.getProducts().pipe(
          map(products =>
            products.filter(product =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        )
      )
    );
  }

  pickProduct(product: Product): void {
    this.productPicked = product;
    this.selectedProduct.emit(product);
    this.searchControl.setValue(`${product.name} - ${product.description}`);
    this.showResults = false;
  }

  resetPicker(): void {
    this.productPicked = null;
    this.searchControl.setValue('');
    this.showResults = false;
  }

  onFocus(): void {
    this.showResults = true;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }


}
