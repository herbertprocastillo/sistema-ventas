import {Timestamp} from '@angular/fire/firestore';

export interface Warehouse {
  id?: string;
  name: string;

  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}

export interface Movement {
  id: string;
  warehouse_id: string;
  product_id: string;
  type: string;
  quantity: number;
  price: number;

  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}
