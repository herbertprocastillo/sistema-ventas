import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData, deleteDoc,
  doc,
  docData,
  Firestore, getDocs,
  query,
  Timestamp, updateDoc,
  where
} from '@angular/fire/firestore';
import {Auth} from '@angular/fire/auth';
import {Field} from '../interfaces/field';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldsService {
  /** INJECTS **/
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  /** COLLECTIONS **/
  private readonly fieldsCollection = collection(this.firestore, 'fields');

  /** GET ALL FIELDS **/
  getFields(): Observable<Field[]> {
    return collectionData(this.fieldsCollection, {idField: 'id'}) as Observable<Field[]>;
  }

  /** GET FIELD BY ID **/
  getFieldById(id: string): Observable<Field> {
    const ref = doc(this.firestore, `fields/${id}`);
    return docData(ref, {idField: 'id'}) as Observable<Field>;
  }

  /** VERIFY IF FIELD EXISTS **/
  async fieldExists(name: string): Promise<boolean> {
    const refQuery = query(this.fieldsCollection, where('name', '==', name));
    const querySnapshot = await getDocs(refQuery);
    return !querySnapshot.empty;
  }

  /** ADD FIELD **/
  async addField(field: Field): Promise<void> {
    const normalizedName = field.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/Ñ/g, "N")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toLowerCase()
      .trim();

    const exists = await this.fieldExists(normalizedName);
    if (exists) {
      throw new Error(`El Campo ${field.name} ya existe.`);
    }

    try {
      const user = this.auth.currentUser;
      if (user) {
        field.name = normalizedName;
        field.createdBy = user.uid;
        field.createdAt = Timestamp.now();
        field.updatedBy = user.uid;
        field.updatedAt = Timestamp.now();
      }
      await addDoc(this.fieldsCollection, field);

    } catch (e) {
      console.error('ERROR! al registrar el campo de futbol.', e);
      throw e;
    }
  }

  /** UPDATE FIELD **/
  async updateField(id: string, field: Partial<Field>): Promise<void> {
    // @ts-ignore
    const normalizedName = field.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/Ñ/g, "N")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toLowerCase()
      .trim();

    const exists = await this.fieldExists(normalizedName);
    if (exists) {
      throw new Error(`El Campo de futbol ${field.name} ya existe.`);
    }

    try {
      const user = this.auth.currentUser;
      if (user) {
        field.name = normalizedName;
        field.updatedBy = user.uid;
        field.updatedAt = Timestamp.now();
      }

      const ref = doc(this.firestore, `fields/${id}`);
      await updateDoc(ref, field);

    } catch (e) {
      console.error('ERROR! al actualizar el Campo de futbol.', e);
      throw e;
    }
  }

  /** DELETE CUSTOMER **/
  async deleteField(id: string): Promise<void> {
    const fieldDoc = doc(this.firestore, `fields/${id}`);
    try {
      await deleteDoc(fieldDoc);
    } catch (e) {
      console.error('ERROR! al borrar el Campo de futbol.', e);
      throw e;
    }
  }
}
