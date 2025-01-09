import {inject, Injectable} from '@angular/core';
import {Auth, User} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference, deleteDoc, doc, docData,
  Firestore, getDocs, runTransaction,
  orderBy,
  query, setDoc, Timestamp, updateDoc, where, getDoc
} from '@angular/fire/firestore';
import {PurchaseOrder, Supplier} from '../interfaces/purchase-order';
import {Observable} from 'rxjs';
import {Inventory} from '../../warehouse/interfaces/warehouse';


@Injectable({
  providedIn: 'root'
})
export class PurchasingService {
  /** INJECTS **/
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  /** COUNTER **/
  private counterDocRef = doc(this.firestore, 'counters/purchaseOrder');

  /** COLLECTIONS **/
  private readonly purchaseOrdersCollection: CollectionReference = collection(this.firestore, 'purchaseOrders');
  private readonly purchaseSuppliersCollection: CollectionReference = collection(this.firestore, 'purchaseSuppliers');

  /** GET PURCHASE ORDERS **/
  getAllOrders(): Observable<PurchaseOrder[]> {
    const ref = query(this.purchaseOrdersCollection, orderBy('createdAt', 'asc'));
    return collectionData(ref, {idField: 'id'}) as Observable<PurchaseOrder[]>;
  }

  /** GET PURCHASE ORDER BY ID **/
  getOrderById(id: string): Observable<PurchaseOrder> {
    const ref = doc(this.firestore, `purchaseOrders/${id}`);
    return docData(ref, {idField: 'id'}) as Observable<PurchaseOrder>;
  }

  /**************************************************************
   ************* UPDATE PURCHASE ORDER STATUS *******************
   **************************************************************/
  async updatePurchaseOrderStatus(id: string, order: Partial<PurchaseOrder>): Promise<void> {
    /* get user with active session */
    const user = this.auth.currentUser;

    /* if user logged, we continue with the rest of the logic  */
    if (user) {
      try {
        /* We update the status with the user data and the date */
        order.updatedBy = user.uid;
        order.updatedAt = Timestamp.now();
        const ref = doc(this.firestore, `purchaseOrders/${id}`);
        await updateDoc(ref, order);

      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }

  /*****************************************************************
   ** OBTAIN THE FOLLOWING CORRELATIVE NUMBER FOR PURCHASE ORDERS **
   *****************************************************************/

  /** WE OBTAIN THE PROVISIONAL ORDER NUMBER FOR THE FORM **/
  async getCurrentOrderNumber(): Promise<string> {
    try {
      const counterDoc = await getDoc(this.counterDocRef);
      const currentOrderNumber = counterDoc.exists() ? counterDoc.data()?.['currentOrderNumber'] : 0;
      return (currentOrderNumber + 1).toString().padStart(9, '0'); /* Provisional order number */
    } catch (e) {
      console.error('Error al obtener el número actual de la orden:', e);
      throw e;
    }
  }

  /** WE OBTAIN THE ORDER NUMBER THAT WILL BE REGISTERED IN THE PURCHASE ORDER **/
  async getNextOrderNumber(): Promise<string> {
    try {
      const orderNumber = await runTransaction(this.firestore, async (transaction) => {
        const counterDoc = await transaction.get(this.counterDocRef);

        if (!counterDoc.exists()) {
          transaction.set(this.counterDocRef, {currentOrderNumber: 1});
          return 1;
        } else {
          const currentOrderNumber = counterDoc.data()?.['currentOrderNumber'] || 0;
          const nextOrderNumber = currentOrderNumber + 1;
          transaction.update(this.counterDocRef, {currentOrderNumber: nextOrderNumber});
          return nextOrderNumber;
        }
      });

      return orderNumber.toString().padStart(9, '0'); /* Final order number */
    } catch (e) {
      console.error('Error al generar el número de orden:', e);
      throw e;
    }
  }

  /**************************************************************
   ***************** ADD NEW PURCHASE ORDER *********************
   **************************************************************/
  async addPurchaseOrder(order: PurchaseOrder): Promise<void> {
    /* get user with active session */
    const user = this.auth.currentUser;

    /* if user logged, we continue with the rest of the logic  */
    if (user) {
      try {
        /* add user ID and date to order */
        order.createdBy = user.uid;
        order.createdAt = Timestamp.now();
        order.updatedBy = user.uid;
        order.updatedAt = Timestamp.now();

        /* add order to collection purchaseOrders */
        await addDoc(this.purchaseOrdersCollection, order);

        /* We go through the list of products that comes with the order to update inventories */
        for (const product of order.products) {

          /* We verify if each of the products on the list is registered in the inventory */
          const ref = collection(this.firestore, 'warehouseInventory');
          const q = query(ref, where('product_id', '==', product.product_id));
          const querySnapshot = await getDocs(q);

          /* If the query comes "NO" it comes empty, we proceed to update the stock,
           * or if it comes empty we register the product in the inventory
           * with the stock and the cost price that comes from the product list */
          if (!querySnapshot.empty) {

            /* We show a log in the console to check the operation */
            console.log("Product found in inventory:", querySnapshot.docs[0].data());

            /* We save the new stock and the new cost price in variables */
            const inventoryDoc = querySnapshot.docs[0];
            const inventory = inventoryDoc.data() as Inventory;
            const newStock = inventory.stock + product.quantity;
            const newPriceCost = product.unitPrice;

            /* we update the inventory */
            await updateDoc(doc(this.firestore, `warehouseInventory/${inventoryDoc.id}`), {
              stock: newStock,
              price_cost: newPriceCost,
              updatedBy: user?.uid,
              updatedAt: Timestamp.now(),
            });

          } else {
            /* Since the product was not found in inventory, we registered it for the first time. */
            await addDoc(collection(this.firestore, `warehouseInventory`), {
              product_id: product.product_id,
              stock: product.quantity,
              price_cost: product.unitPrice,
              price_sale: 0,
              createdBy: user?.uid,
              createdAt: Timestamp.now(),
            });
          }
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }


  /** UPDATE PURCHASE ORDERS **/
  async updateOrder(id: string, order: Partial<PurchaseOrder>): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        order.updatedBy = user.uid;
        order.updatedAt = Timestamp.now();
      }
      const ref = doc(this.firestore, `purchaseOrders/${id}`);
      await updateDoc(ref, order);
    } catch (e) {
      console.error('ERROR! al actualizar la orden de compra.', e);
      throw e;
    }
  }

  /** DELETE PURCHASE ORDERS **/
  async deleteOrder(id: string): Promise<void> {
    const ref = doc(this.firestore, `purchaseOrders/${id}`);
    try {
      await deleteDoc(ref);
    } catch (e) {
      console.error('ERROR! al borrar la orden de compra.', e);
      throw e;
    }
  }

  /**********************************************************************************************
   *************************************** SUPPLIERS ********************************************
   **********************************************************************************************/

  /** VERIFY IF SUPPLIER EXISTS **/
  async supplierExists(company: string): Promise<boolean> {
    const ref = query(this.purchaseSuppliersCollection, where('company', '==', company));
    const querySnapshot = await getDocs(ref);
    return !querySnapshot.empty;
  }

  /** GET SUPPLIERS **/
  getSuppliers(): Observable<Supplier[]> {
    const ref = query(this.purchaseSuppliersCollection, orderBy('createdAt', 'asc'));
    return collectionData(ref, {idField: 'id'}) as Observable<Supplier[]>;
  }

  /** GET SUPPLIER BY ID **/
  getSupplierById(id: string): Observable<Supplier> {
    const ref = doc(this.firestore, `purchaseSuppliers/${id}`);
    return docData(ref, {idField: 'id'}) as Observable<Supplier>;
  }

  /** ADD SUPPLIER **/
  async addSupplier(supplier: Supplier): Promise<void> {
    const normalizedCompany = supplier.company
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/Ñ/g, "N")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toLowerCase()
      .trim();
    const exists
      :
      boolean = await this.supplierExists(normalizedCompany);
    if (exists) {
      throw new Error(`La compañia ${supplier.company} ya existe`);
    }
    try {
      const user = this.auth.currentUser;
      if (user) {
        supplier.company = normalizedCompany;
        supplier.fullName = supplier.fullName.toLowerCase();
        supplier.createdBy = user.uid;
        supplier.createdAt = Timestamp.now();
        supplier.updatedBy = user.uid;
        supplier.updatedAt = Timestamp.now();
      }
      await addDoc(this.purchaseSuppliersCollection, supplier);
    } catch (e) {
      console.error('ERROR! al registrar al proveedor.', e);
      throw e;
    }
  }

  /** UPDATE SUPPLIER **/
  async updateSupplier(id: string, supplier: Partial<Supplier>): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        supplier.company = supplier.company?.toLowerCase();
        supplier.fullName = supplier.fullName?.toLowerCase();
        supplier.updatedBy = user.uid;
        supplier.updatedAt = Timestamp.now();
      }
      const ref = doc(this.firestore, `purchaseSuppliers/${id}`);
      await updateDoc(ref, supplier);
    } catch (e) {
      console.error('ERROR! al actualizar el proveedor.', e);
      throw e;
    }
  }

  /** DELETE SUPPLIER **/
  async deleteSupplier(id: string): Promise<void> {
    const ref = doc(this.firestore, `purchaseSuppliers/${id}`);
    try {
      await deleteDoc(ref);
    } catch (e) {
      console.error('ERROR! al borrar el proveedor.', e);
      throw e;
    }
  }
}
