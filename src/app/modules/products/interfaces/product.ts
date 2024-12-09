import {Timestamp} from '@angular/fire/firestore';

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  barCode: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}
export interface Category {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
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
