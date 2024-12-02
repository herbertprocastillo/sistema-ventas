import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, Firestore, Timestamp} from '@angular/fire/firestore';
import {Sale} from '../interfaces/sale';
import {AuthService} from '../../auth/services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  /** INJECTS **/
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  /** COLLECTIONS **/
  private salesCollection = collection(this.firestore, 'sales');

  /** CRUD - GET ALL **/
  getSales(): Observable<Sale[]> {
    return collectionData(this.salesCollection, {idField: 'id'}) as Observable<Sale[]>;
  }

  /** CRUD - ADD SALE **/
  async addSale(sale: Sale): Promise<void> {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        sale.createdBy = user.uid;
        sale.createdAt = Timestamp.now();
      }
      await addDoc(this.salesCollection, sale);
    } catch (error) {
      console.error("ERROR AL REGISTRAR LA VENTA", error);
      throw error;
    }
  }

}
