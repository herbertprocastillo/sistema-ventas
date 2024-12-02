import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  Firestore, getDoc, getDocs, orderBy, query,
  Timestamp,
  updateDoc, where
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Auth} from '@angular/fire/auth';
import {Category, Product} from '../interfaces/product';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  /** INJECTS **/
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  /** VARIABLES **/
  private readonly categoriesCollection: CollectionReference;
  private readonly productsCollection: CollectionReference;
  private timestamp = Timestamp.now();

  constructor() {
    this.categoriesCollection = collection(this.firestore, 'categories');
    this.productsCollection = collection(this.firestore, 'products');
  }

  /** GET ALL CATEGORIES **/
  getCategories(): Observable<Category[]> {
    const refQuery = query(this.categoriesCollection, orderBy('name', 'asc'));
    return collectionData(refQuery, {idField: 'id'}) as Observable<Category[]>;
  }

  /** GET CATEGORY BY ID **/
  getCategoryById(id: string): Observable<Category> {
    const refDoc = doc(this.firestore, `categories/${id}`);
    return docData(refDoc, {idField: 'id'}) as Observable<Category>;
  }

  /****************************************
   ******* ADD AND UPDATED CATEGORY *******
   ****************************************/
  /** VERIFY IF CATEGORY EXISTS **/
  async categoryExists(name: string): Promise<boolean> {
    const refQuery = query(this.categoriesCollection, where('name', '==', name));
    const querySnapshot = await getDocs(refQuery);
    return !querySnapshot.empty;
  }

  /** ADD NEW CATEGORY **/
  async addCategory(category: Category): Promise<void> {
    const normalizedName = category.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/Ñ/g, "N")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toLowerCase()
      .trim();

    const exists: boolean = await this.categoryExists(normalizedName);

    if (exists) {
      throw new Error(`La categoria ${category.name} ya existe`);
    }

    try {
      const user = this.auth.currentUser;

      if (user) {
        category.name = normalizedName;
        category.createdBy = user.uid;
        category.createdAt = this.timestamp;
        category.updatedBy = user.uid;
        category.updatedAt = this.timestamp;
      }

      await addDoc(this.categoriesCollection, category);

    } catch (e) {
      console.error('ERROR! al registrar la categoria.', e);
      throw e;
    }
  }

  /** UPDATE CATEGORY **/
  async updateCategory(id: string, category: Partial<Category>): Promise<void> {
    // @ts-ignore
    const normalizedName = category.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/Ñ/g, "N")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toLowerCase()
      .trim();

    const exists = await this.categoryExists(normalizedName);

    if (exists) {
      throw new Error(`La categoria ${category.name} ya existe.`);
    }

    try {
      const user = this.auth.currentUser;

      if (user) {
        category.name = normalizedName;
        category.updatedBy = user.uid;
        category.updatedAt = this.timestamp;
      }

      const refDoc = doc(this.firestore, `categories/${id}`);
      await updateDoc(refDoc, category);

    } catch (e) {
      console.error('ERROR! al actualizar la categoria.', e);
      throw e;
    }
  }

  /****************************************
   *********** DELETE CATEGORY ************
   ****************************************/
  /** VERIFY IF CATEGORY IS IN USE **/
  isCategoryInUse(categoryId: string): Observable<boolean> {
    const productsQuery = query(this.productsCollection, where('category_id', '==', categoryId));
    return collectionData(productsQuery).pipe(
      map((products: Product[]) => products.length > 0)
    );
  }

  /** DELETE CATEGORY **/
  async deleteCategory(id: string): Promise<void> {
    const categoriesDoc = doc(this.firestore, `categories/${id}`);
    try {
      await deleteDoc(categoriesDoc);
    } catch (e) {
      console.error('ERROR! al borrar la categoria.', e);
      throw e;
    }
  }
}
