import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  orderBy,
  query, setDoc,
  Timestamp, updateDoc
} from '@angular/fire/firestore';
import {Auth} from '@angular/fire/auth';
import {Observable, switchMap} from 'rxjs';
import {Inventory, Movement} from '../interfaces/warehouse';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  /** INJECT **/
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  /** COLLECTIONS **/
  private readonly movementsCollection = collection(this.firestore, 'warehouseMovements');
  private readonly inventoryCollection = collection(this.firestore, 'warehouseInventory');
  private readonly productsCollection = collection(this.firestore, 'products');

  /** GET ALL MOVEMENTS **/
  getMovements(): Observable<Movement[]> {
    const q = query(this.movementsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, {idField: 'id'}) as Observable<Movement[]>;
  }

  /** GET MOVEMENT BY ID **/
  getMovementById(id: string): Observable<Movement> {
    const ref = doc(this.firestore, `warehouseMovements/${id}`);
    return docData(ref, {idField: 'id'}) as Observable<Movement>;
  }

  /** ADD MOVEMENT **/
  async addMovement(movement: Movement): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      movement.createdBy = user.uid;
      movement.createdAt = Timestamp.now();
      movement.updatedBy = user.uid;
      movement.updatedAt = Timestamp.now();
    }
    try {
      await addDoc(this.movementsCollection, movement);
    } catch (e) {
      console.error("Error! al registrar el movimiento. ", e);
      throw e;
    }
  }

  /** UPDATE MOVEMENT **/
  async updateMovement(id: string, movement: Partial<Movement>): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      movement.updatedBy = user.uid;
      movement.updatedAt = Timestamp.now();
    }
    try {
      const ref = doc(this.firestore, `warehouseMovements/${id}`);
      await updateDoc(ref, movement);
    } catch (e) {
      console.error("Error! al actualizar el movimiento. ", e);
      throw e;
    }
  }

  /** DELETE MOVEMENT **/
  async deleteMovement(id: string): Promise<void> {
    try {
      const ref = doc(this.firestore, `warehouseMovements/${id}`);
      await deleteDoc(ref);
    } catch (e) {
      console.error("Error! al borrar el movimiento. ", e);
      throw e;
    }
  }

  /** GET ALL INVENTORY **/
  getInventory(): Observable<Inventory[]> {
    const ref = query(this.inventoryCollection, orderBy('updatedAt', 'desc'));
    return collectionData(ref, {idField: 'id'}) as Observable<Inventory[]>;
  }

  /** GET PRODUCTS FROM INVENTORY FOR SALE **/
  getInventoryWithProducts(): Observable<any[]> {
    return collectionData(this.inventoryCollection, {idField: 'id'}).pipe(
      switchMap((inventory: any[]) => {
        const inventoryMap = new Map(
          inventory.map((inv: any) => [inv.product_id, inv])
        );

        return collectionData(this.productsCollection, {idField: 'id'}).pipe(
          map((products: any[]) =>
            products
              .filter((product: any) => {
                const inventory = inventoryMap.get(product.id);

                if (!inventory) {
                  console.warn(`No inventory found for product ID: ${product.id}`);
                  return false; // Excluir si no hay inventario
                }

                if (inventory.stock <= 0) {
                  console.warn(`Product ID: ${product.id} has no stock available`);
                  return false; // Excluir si el stock es <= 0
                }

                return true; // Incluir si tiene inventario y stock > 0
              })
              .map((product: any) => {
                const inventory = inventoryMap.get(product.id);
                return {
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  barCode: product.barCode,
                  imageUrl: product.imageUrl,
                  price_sale: inventory.price_sale,
                  stock: inventory.stock,
                };
              })));
      })
    );
  }

  /** ADD NEW INVENTORY **/
  async addInventory(productId: string, quantity: number, price_cost: number): Promise<void> {
    const inventoryRef = doc(this.firestore, `warehouseInventory/${productId}`);
    const newInventory = {} as Inventory;
    const user = this.auth.currentUser;

    if (user) {
      newInventory.product_id = productId;
      newInventory.stock = quantity;
      newInventory.price_cost = price_cost;
      newInventory.price_sale = 0;
      newInventory.createdBy = user.uid;
      newInventory.createdAt = Timestamp.now();
      newInventory.updatedBy = user.uid;
      newInventory.updatedAt = Timestamp.now();
    }

    try {
      await setDoc(inventoryRef, newInventory);
    } catch (e) {
      console.error("Error! al registrar el inventario. ", e);
    }
  }

  /** UPDATE INVENTORY **/
  async updateMovementInventory(productId: string, type: 'INGRESO' | 'SALIDA', quantity: number, price: number, inventoryData: any): Promise<void> {
    let newStock = inventoryData.stock;
    if (type === 'INGRESO') {
      newStock += quantity;
    } else if (type === 'SALIDA') {
      if (inventoryData.stock < quantity) {
        throw new Error("No hay suficiente stock para realizar el movimiento.");
      }
      newStock -= quantity;
    }
    const inventoryRef = doc(this.firestore, `warehouseInventory/${productId}`);
    const newInventory = {} as Inventory;
    const user = this.auth.currentUser;
    if (user) {
      newInventory.stock = newStock;
      newInventory.price_cost = price;
      newInventory.price_sale = inventoryData.price_sale;
      newInventory.updatedBy = user.uid;
      newInventory.updatedAt = Timestamp.now();
    }
    try {
      await updateDoc(inventoryRef, {...newInventory});
    } catch (e) {
      console.error("Error! al actualizar el inventario. ", e);
    }
  }

  /** UPDATE INVENTORY **/
  async updateInventory(id: string, price_sale: number, price_cost: number, stock: number): Promise<void> {
    const ref = doc(this.firestore, `warehouseInventory/${id}`);
    const updateInventory = {} as Inventory;

    const user = this.auth.currentUser;

    if (user) {
      updateInventory.price_sale = price_sale;
      updateInventory.price_cost = price_cost;
      updateInventory.stock = stock;
      updateInventory.updatedBy = user.uid;
      updateInventory.updatedAt = Timestamp.now();
    }

    try {
      await updateDoc(ref, {...updateInventory});

    } catch (e) {
      console.error("ERROR! Al actualizar el inventario. ", e);
    }
  }

  /** UPDATE STOCK **/
  async updateInventoryStock(productId: string, newStock: number): Promise<void> {
    const ref = doc(this.firestore, `warehouseInventory/${productId}`);
    await updateDoc(ref, {stock: newStock});
  }
}
