import {Timestamp} from '@angular/fire/firestore';

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  dni: string;
  phone: string;
  reservations?: string[];

  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}
