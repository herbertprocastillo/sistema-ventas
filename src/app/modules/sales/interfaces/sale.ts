import {Timestamp} from '@angular/fire/firestore';

export interface Sale {
  id?: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  cashReceived?: number;
  cashChange?: number;
  status?: string;
  /** TERMINADA -- ANULADA  **/

  createdBy?: string;
  createdAt?: Timestamp;
  updatedBy?: string;
  updatedAt?: Timestamp;
}

export interface SaleItem {
  product_id: string;
  product_name: string;
  availableStock: number;
  quantity: number;
  price_sale: number;
  subtotal: number;

  createdBy?: string;
  createdAt?: Timestamp;
}
