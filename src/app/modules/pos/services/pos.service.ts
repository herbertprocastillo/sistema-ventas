import {inject, Injectable} from '@angular/core';
import {
  collection,
  CollectionReference,
  doc,
  docData,
  Firestore,
  query,
  where,
  runTransaction, Timestamp, addDoc, collectionData, orderBy
} from '@angular/fire/firestore';
import {Auth} from '@angular/fire/auth';
import {CashRegister} from '../interfaces/pos';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PurchaseOrder} from '../../purchasing/interfaces/purchase-order';


@Injectable({
  providedIn: 'root'
})
export class PosService {
  /** INJECTS **/
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  /** COUNTER **/
  private counterDocRef = doc(this.firestore, 'counters/cashRegister');

  /** COLLECTIONS **/
  private readonly cashRegistersCollection: CollectionReference = collection(this.firestore, 'posCashRegisters');

  /** GET ALL CASH REGISTER **/
  getCashRegisters(): Observable<CashRegister[]> {
    const ref = query(this.cashRegistersCollection, orderBy('createdAt', 'asc'));
    return collectionData(ref, {idField: 'id'}) as Observable<CashRegister[]>;
  }

  /** OBTAIN THE CORRELATIVE NUMBER FOR THE CASH REGISTER **/
  async getNextCashRegisterNumber(): Promise<string> {
    try {
      const cashRegisterNumber = await runTransaction(this.firestore, async (transaction) => {
        const counterDoc = await transaction.get(this.counterDocRef);

        if (!counterDoc.exists()) {
          transaction.set(this.counterDocRef, {currentCashRegister: 1});
          return 1;
        } else {
          const currentCashRegisterNumber = counterDoc.data()?.['currentCashRegisterNumber'] || 0;
          const nextCashRegisterNumber = currentCashRegisterNumber + 1;
          transaction.update(this.counterDocRef, {currentCashRegisterNumber: nextCashRegisterNumber});
          return nextCashRegisterNumber;
        }
      });

      return cashRegisterNumber.toString().padStart(9, '0'); /* Final cash register number */
    } catch (e) {
      console.error('Error al generar el número de la caja registradora:', e);
      throw e;
    }
  }

  /** GET OPEN CASH REGISTER **/
  getOpenCashRegisterByUser(user_id: string): Observable<any | null> {
    const ref = query(this.cashRegistersCollection, where('user_id', '==', user_id), where('status', '==', 'ABIERTA'));
    return collectionData(ref, {idField: 'id'}).pipe(
      map((data: any) => (data.length > 0 ? data[0] : null)) /* Returns the first open box or null if there is none */
    );
  }

  /** ADD OPEN CASH REGISTER **/
  async addOpenCashRegister(cashRegister: CashRegister): Promise<void> {
    try {
      const user = this.auth.currentUser;

      if (user) {
        cashRegister.createdBy = user.uid;
        cashRegister.createdAt = Timestamp.now();
      }

      await addDoc(this.cashRegistersCollection, cashRegister);

    } catch (e) {
      console.error('ERROR! al abrir una nueva caja registradora.', e);
      throw e;
    }
  }

}
