import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData, deleteDoc,
  doc,
  docData,
  Firestore,
  getDocs,
  query,
  Timestamp, updateDoc,
  where
} from '@angular/fire/firestore';
import {Auth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {Customer} from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  /** INJECTS **/
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  /** COLLECTIONS **/
  private readonly customersCollection = collection(this.firestore, 'customers');

  /** GET ALL CUSTOMERS **/
  getCustomers(): Observable<Customer[]> {
    return collectionData(this.customersCollection, {idField: 'id'}) as Observable<Customer[]>;
  }

  /** GET CUSTOMER BY ID **/
  getCustomerById(id: string): Observable<Customer> {
    const ref = doc(this.customersCollection, `customers/${id}`);
    return docData(ref, {idField: 'id'}) as Observable<Customer>;
  }

  /** VERIFY IF CUSTOMER EXISTS **/
  async customerExists(dni: string): Promise<boolean> {
    const refQuery = query(this.customersCollection, where('dni', '==', dni));
    const querySnapshot = await getDocs(refQuery);
    return !querySnapshot.empty;
  }

  /** ADD NEW CUSTOMER **/
  async addCustomer(customer: Customer): Promise<void> {
    const normalizedDNI = customer.dni
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/Ñ/g, "N")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toLowerCase()
      .trim();
    const exists: boolean = await this.customerExists(normalizedDNI);
    if (exists) {
      throw new Error(`El dni del cliente ${customer.dni} ya existe.`);
    }
    try {
      const user = this.auth.currentUser;
      if (user) {
        customer.dni = normalizedDNI;
        customer.createdBy = user.uid;
        customer.createdAt = Timestamp.now();
        customer.updatedBy = user.uid;
        customer.updatedAt = Timestamp.now();
      }
      await addDoc(this.customersCollection, customer);
    } catch (e) {
      console.error('ERROR! al registrar el cliente.', e);
      throw e;
    }
  }

  /** UPDATE CUSTOMER **/
  async updateCustomer(id: string, customer: Partial<Customer>): Promise<void> {
    // @ts-ignore
    const normalizedDNI = customer.dni
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/Ñ/g, "N")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toLowerCase()
      .trim();
    const exists = await this.customerExists(normalizedDNI);
    if (exists) {
      throw new Error(`El dni del cliente ${customer.dni} ya existe.`);
    }

    try {
      const user = this.auth.currentUser;
      if (user) {
        customer.dni = normalizedDNI;
        customer.updatedBy = user.uid;
        customer.updatedAt = Timestamp.now();
      }

      const ref = doc(this.firestore, `customers/${id}`);
      await updateDoc(ref, customer);

    } catch (e) {
      console.error('ERROR! al actualizar el cliente.', e);
      throw e;
    }
  }

  /** DELETE CUSTOMER **/
  async deleteCustomer(id: string): Promise<void> {
    const customerDoc = doc(this.firestore, `customers/${id}`);
    try {
      await deleteDoc(customerDoc);
    } catch (e) {
      console.error('ERROR! al borrar el cliente.', e);
      throw e;
    }
  }
}
