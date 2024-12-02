import {Timestamp} from '@angular/fire/firestore';

export interface Sale {
  id?: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;

  createdBy?: string;
  createdAt?: Timestamp;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;

  createdBy?: string;
  createdAt?: Timestamp;
}
