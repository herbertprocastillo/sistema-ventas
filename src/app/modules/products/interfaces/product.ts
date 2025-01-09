import {Timestamp} from '@angular/fire/firestore';

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  imageUrl: string;
  barCode: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;

  /** Display Fields **/
  category_name?: string;
  created_by_name?: string;
  updated_by_name?: string;
}

export interface Category {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;

  /** Display Fields **/
  created_by_name?: string;
  updated_by_name?: string;
}

export interface PosSale {
  id: string;
  name: string;
  description: string;
  barCode: string;
  imageUrl: string;
  price_sale: number;
  stock: number;
}
