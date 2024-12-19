import {Timestamp} from '@angular/fire/firestore';

export interface Product {
  id: string;
  category_id: string;
  categoryName?: string; // Campo opcional para el nombre de la categoría
  name: string;
  description: string;
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
