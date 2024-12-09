import {Timestamp} from '@angular/fire/firestore';

export interface Field {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  type: 'INDIVIDUAL' | 'COMBINADO';
  relatedFields?: string[]; //id de los campos relacionados
  status: 'DISPONIBLE' | 'OCUPADO' | 'RESERVADO' | 'MANTENIMIENTO';

  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}

export interface Reservation {
  id: string;
  field_id: string;
  customer_id: string;
  starTime: Timestamp;
  endTime: Timestamp;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';

  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}

export interface Rate {
  id: string;
  field_id: string;
  name: string;
  pricePerHour: number;
  additionalDetails?: string; //detalles adicionales como tarifas especiales

  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}
