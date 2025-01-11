import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {PosSale} from '../../../../products/interfaces/product';
import {WarehouseService} from '../../../../warehouse/services/warehouse.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-pos-products',
  standalone: true,
  imports: [FormsModule, NgForOf],
  templateUrl: './pos-products.component.html',
  styleUrl: './pos-products.component.scss'
})
export class PosProductsComponent implements OnInit, OnDestroy, AfterViewInit {
  /** IO **/
  @Output() addToCart = new EventEmitter<PosSale>();
  @ViewChild('searchInput') searchInput!: ElementRef;

  /** INJECTS **/
  private warehouseService = inject(WarehouseService);

  /** COLLECTIONS **/
  public listProducts: PosSale[] = [];

  /** VARIABLES **/
  public searchTerm: string = '';
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.warehouseService.getInventoryWithProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (combinedProducts: PosSale[]) => {
          this.listProducts = combinedProducts;
        },
        error: (e) => console.error('Error:', e),
      });
  }

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(): void {
    const searchTerm: string = this.searchTerm.trim().toLowerCase() || '';
    const product = this.listProducts.find(
      (p: PosSale) => p.barCode?.toLowerCase() === searchTerm
    );
    if (product) {
      this.onAddToCart(product);
      this.searchTerm = '';
      this.searchInput.nativeElement.value = '';
    }
  }

  onAddToCart(product: PosSale): void {
    this.addToCart.emit(product);
  }

  filterProducts(): PosSale[] {
    const searchTerm: string = this.searchTerm?.trim().toLowerCase() || '';

    return this.listProducts.filter((product: PosSale) =>
      (product.name?.includes(searchTerm) || false) ||
      (product.description?.includes(searchTerm) || false) ||
      (product.barCode?.includes(searchTerm) || false)
    );
  }
}
