import {inject, Injectable} from '@angular/core';
import {Movement} from '../interfaces/warehouse';
import {Observable} from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc, docData,
  Firestore,
  Timestamp, updateDoc
} from '@angular/fire/firestore';
import {AuthService} from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {
  /** INJECTS **/
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);

  /** COLLECTIONS **/
  private movementsCollection = collection(this.firestore, 'warehousesMovements');

  /** VARIABLES **/
  private timestamp = Timestamp.now();


  /** CRUD - GET ALL **/
  getMovements(): Observable<Movement[]> {
    return collectionData(this.movementsCollection, {idField: 'id'})
      .pipe() as Observable<Movement[]>;
  }

  /** CRUD - GET BY ID **/
  getMovementById(id: string): Observable<Movement> {
    const ref = doc(this.firestore, `warehousesMovements/${id}`);
    return docData(ref, {idField: 'id'}) as Observable<Movement>;
  }

  /** CRUD - ADD NEW **/
  async addMovement(movement: Movement): Promise<void> {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        movement.createdBy = user.uid;
        movement.createdAt = this.timestamp;
        movement.updatedBy = user.uid;
        movement.updatedAt = this.timestamp;
      }
      await addDoc(this.movementsCollection, movement);

    } catch (error) {
      console.error("ERROR AL REGISTRAR EL MOVIMIENTO", error);
      throw error;
    }
  }

  /** CRUD - UPDATE **/
  async updateMovement(id: string, movement: Partial<Movement>): Promise<void> {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        movement.updatedBy = user.uid;
        movement.updatedAt = this.timestamp;
      }
      const ref = doc(this.firestore, `warehousesMovements/${id}`);
      await updateDoc(ref, movement);

    } catch (error) {
      console.error("ERROR AL ACTUALIZAR EL MOVIMIENTO", error);
      throw error;
    }
  }

  /** CRUD - DELETE **/
  async deleteMovement(id: string): Promise<void> {
    try {
      const ref = doc(this.firestore, `warehousesMovements/${id}`);
      await deleteDoc(ref);

    } catch (error) {
      console.error("ERROR AL BORRAR EL MOVIMIENTO", error);
      throw error;
    }
  }

}
