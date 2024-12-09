import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Product} from '../../interfaces/product';
import {ProductsService} from '../../services/products.service';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss'
})
export class ProductInfoComponent implements OnInit {
  @Input() productId: string | undefined;
  product$: Observable<Product> | undefined;

  constructor(private productsService: ProductsService) {
  }

  ngOnInit(): void {
    if (this.productId) {
      this.product$ = this.productsService.getProductById(this.productId);
    }
  }
}
