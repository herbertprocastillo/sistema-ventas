import {inject, Injectable} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  Timestamp,
  CollectionReference, doc, docData, updateDoc, deleteDoc, query, orderBy, where
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Movement, Warehouse} from '../interfaces/warehouse';
import {Auth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  /** INJECTS **/
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  /** COLLECTIONS **/
  private readonly warehouseCollection: CollectionReference;
  private readonly movementsCollection: CollectionReference;
  /** VARIABLES **/
  private timestamp = Timestamp.now();

  constructor() {
    this.warehouseCollection = collection(this.firestore, 'warehouses');
    this.movementsCollection = collection(this.firestore, 'movements');
  }

  /** GET ALL WAREHOUSES **/
  getWarehouses(): Observable<Warehouse[]> {
    const warehousesQuery = query(this.warehouseCollection, orderBy('name', 'asc'));
    return collectionData(warehousesQuery, {idField: 'id'}) as Observable<Warehouse[]>;
  }

  /** GET WAREHOUSE BY ID **/
  getWarehouseById(id: string): Observable<Warehouse> {
    const warehouseDoc = doc(this.firestore, `warehouses/${id}`);
    return docData(warehouseDoc, {idField: 'id'}) as Observable<Warehouse>;
  }

  /** ADD NEW WAREHOUSE **/
  async addWarehouse(warehouse: Warehouse): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        warehouse.createdBy = user.uid;
        warehouse.createdAt = this.timestamp;
        warehouse.updatedBy = user.uid;
        warehouse.updatedAt = this.timestamp;
      }
      await addDoc(this.warehouseCollection, warehouse);
    } catch (e) {
      console.error("ERROR! al registrar el almacen.", e);
      throw e;
    }
  }

  /** UPDATE WAREHOUSE **/
  async updateWarehouse(id: string, warehouse: Partial<Warehouse>): Promise<void> {
    const warehouseDoc = doc(this.firestore, `warehouses/${id}`);
    try {
      const user = this.auth.currentUser;
      if (user) {
        warehouse.updatedBy = user.uid;
        warehouse.updatedAt = this.timestamp;
      }
      await updateDoc(warehouseDoc, warehouse);
    } catch (e) {
      console.error('ERROR! al actualizar el almacen.', e);
      throw e;
    }
  }

  /** VERIFY IF WAREHOUSE **/
  isWarehouseInUse(warehouseId: string): Observable<boolean> {
    const movementsQuery = query(this.movementsCollection, where('warehouse_id', '==', warehouseId), where('quantity', '>', 0));
    return collectionData(movementsQuery).pipe(
      map((movement: Movement[]) => movement.length > 0)
    );
  }

  /** DELETE CATEGORY **/
  async deleteWarehouse(id: string): Promise<void> {
    const warehouseDoc = doc(this.firestore, `warehouses/${id}`);
    try {
      await deleteDoc(warehouseDoc);
    } catch (e) {
      console.error('ERROR! al eliminar el almacen.', e);
      throw e;
    }
  }
}
