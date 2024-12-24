import {Timestamp} from '@angular/fire/firestore';

export interface Movement {
  id?: string;
  type: 'INGRESO' | 'SALIDA';
  quantity: number;
  price: number;

  product_id: string;
  product_name?: string;

  createdBy: string;
  createdAt: Timestamp;
  updatedBy?: string;
  updatedAt?: Timestamp;
}

export interface Inventory {
  id?: string;
  stock: number;
  price_cost: number;
  price_sale: number;

  product_id: string;
  category_name?: string;
  product_name?: string;
  product_description?: string;
  product_image?: string;
  product_barCode?: string;

  createdBy: string;
  createdAt: Timestamp;
  updatedBy?: string;
  updatedAt?: Timestamp;
}
