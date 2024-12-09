import {Timestamp} from '@angular/fire/firestore';

export interface Movement {
  id?: string;
  product_id: string;
  type: 'INGRESO' | 'SALIDA';
  quantity: number;
  price: number;

  createdBy: string;
  createdAt: Timestamp;
  updatedBy?: string;
  updatedAt?: Timestamp;
}

export interface Inventory {
  id?: string;
  product_id: string;
  stock: number;

  price_cost: number;
  price_sale: number;

  createdBy: string;
  createdAt: Timestamp;
  updatedBy?: string;
  updatedAt?: Timestamp;
}
