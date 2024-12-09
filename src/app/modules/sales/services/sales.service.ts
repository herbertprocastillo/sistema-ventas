import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, Firestore, orderBy, query, Timestamp} from '@angular/fire/firestore';
import {Sale} from '../interfaces/sale';
import {AuthService} from '../../auth/services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  /** INJECTS **/
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  /** COLLECTIONS **/
  private salesCollection = collection(this.firestore, 'sales');

  /** GET ALL SALES **/
  getSales(): Observable<Sale[]> {
    const q = query(this.salesCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, {idField: 'id'}) as Observable<Sale[]>;
  }

  /** ADD NEW SALE **/
  async addSale(sale: Sale): Promise<void> {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        sale.createdBy = user.uid;
        sale.createdAt = Timestamp.now();
      }
      await addDoc(this.salesCollection, sale);
    } catch (e) {
      console.error("ERROR! al registrar la venta.", e);
      throw e;
    }
  }

}
