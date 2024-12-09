import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from '@angular/common';
import {SaleItem} from '../../../sales/interfaces/sale';

@Component({
  selector: 'app-pos-cart',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './pos-cart.component.html',
  styleUrl: './pos-cart.component.scss'
})
export class PosCartComponent {
  @Input() items: SaleItem[] = [];
  @Output() removeItem = new EventEmitter<SaleItem>();

  onRemoveItem(item: SaleItem): void {
    this.removeItem.emit(item);
  }
}
