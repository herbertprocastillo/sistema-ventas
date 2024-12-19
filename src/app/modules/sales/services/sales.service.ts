import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, Firestore, orderBy, query, Timestamp} from '@angular/fire/firestore';
import {Sale} from '../interfaces/sale';
import {AuthService} from '../../auth/services/auth.service';
import {Observable} from 'rxjs';
import {WarehouseService} from '../../warehouse/services/warehouse.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  /** INJECTS **/
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private warehouseService = inject(WarehouseService);

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
      /** Calculate new stock **/
      sale.items.map(async (item) => {
          const newStock = item.availableStock - item.quantity;
          if (newStock < 0) {
            console.error(`ERROR! stock insuficiente para el producto ${item.productName}`);
          }
          /** Update Stock **/
          await this.warehouseService.updateInventoryStock(item.productId, newStock);
        }
      )

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
