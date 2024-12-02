import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {Product} from '../../../products/interfaces/product';
import {ProductsService} from '../../../products/services/products.service';

@Component({
  selector: 'app-pos-products',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './pos-products.component.html',
  styleUrl: './pos-products.component.scss'
})
export class PosProductsComponent implements OnInit {
  @Output() addToCart = new EventEmitter<Product>();
  products: Product[] = [];
  searchTerm: string = '';

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  onAddToCart(product: Product): void {
    this.addToCart.emit(product);
  }

  filterProducts(): Product[] {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
