import {Timestamp} from '@angular/fire/firestore';

export interface Movement {
  id: string;
  product_id: string;
  type: 'INGRESO' | 'SALIDA';
  quantity: number;
  price: number;
  createdBy: string;
  createdAt: Timestamp;
  updatedBy?: string;
  updatedAt?: Timestamp;

  /** Display Fields **/
  product_name?: string;
  created_by_name?: string;
  updated_by_name?: string;
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

  /** Display Fields **/
  category_name?: string;
  product_category_id?: string;
  product_name?: string;
  product_description?: string;
  product_image?: string;
  product_barCode?: string;
}
