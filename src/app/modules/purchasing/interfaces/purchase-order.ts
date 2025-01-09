import {Timestamp} from '@angular/fire/firestore';

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier_id: string;
  products: {
    product_id: string;
    product_name?: string;/* DISPLAY FIELD */
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  total: number;
  comments?: string;
  status: string;/* COMPLETA - ANULADA*/
  createdBy: string;
  createdAt: Timestamp;
  updatedBy?: string;
  updatedAt?: Timestamp;

  /** DISPLAY FIELDS **/
  supplier_company?: string;
  supplier_ruc?: string;
  supplier_name?: string;
  supplier_dni?: string;
  supplier_phone?: string;
  created_by_name?: string;
  updated_by_name?: string;
}

export interface Supplier {
  id: string;
  fullName: string;
  dni: string;
  phone: string;
  email: string;
  company: string;
  ruc: string;
  address: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;

  /** DISPLAY FIELDS **/
  created_by_name?: string;
  updated_by_name?: string;

}
