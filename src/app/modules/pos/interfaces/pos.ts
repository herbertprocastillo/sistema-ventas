import {Timestamp} from '@angular/fire/firestore';

export interface Pos {
  id?: string;
  cashRegister_id: string; /* Linked cash register */
  user_id: string;
  openDate: Timestamp;
  closeDate?: Timestamp;
  status: 'ABIERTA' | 'CERRADA';

  createdBy: string;
  createdAt: Timestamp;
}

export interface CashRegister {
  id?: string;
  number: string;/* Correlative number */
  seller_id: string;
  openDate: Timestamp;
  closeDate?: Timestamp;
  openingAmount: number;
  totalAmount: number;
  status: 'ABIERTA' | 'CERRADA';
  createdBy: string;
  createdAt: Timestamp;

  /** DISPLAY FIELDS **/
  seller_name?: string;
  created_by_name?: string;
  updated_by_name?: string;
}
