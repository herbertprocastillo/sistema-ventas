import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDoc, getDocs, orderBy, query,
  Timestamp,
  updateDoc, where
} from '@angular/fire/firestore';
import {deleteObject, getDownloadURL, getMetadata, ref, Storage, uploadBytes} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {Product} from '../interfaces/product';
import {Auth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  /** INJECTS **/
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private auth = inject(Auth);

  /** VARIABLES **/
  private readonly productsCollection: CollectionReference = collection(this.firestore, 'products');

  /** GET ALL PRODUCTS **/
  getProducts(): Observable<Product[]> {
    const ref = query(this.productsCollection, orderBy('name', 'asc'));
    return collectionData(ref, {idField: 'id'}) as Observable<Product[]>;
  }

  /** GET PRODUCT BY ID **/
  getProductById(id: string): Observable<Product> {
    const ref = doc(this.firestore, `products/${id}`);
    return docData(ref, {idField: 'id'}) as Observable<Product>;
  }

  /****************************************
   ******* ADD AND UPDATED PRODUCT ********
   ****************************************/
  /** VERIFY IF PRODUCT EXISTS **/
  async productExists(name: string): Promise<boolean> {
    const refQuery = query(this.productsCollection, where('name', '==', name));
    const querySnapshot = await getDocs(refQuery);
    return !querySnapshot.empty;
  }

  /** ADD NEW PRODUCT **/
  async addProduct(product: Product, imageFile?: File): Promise<void> {
    const normalizedName = product.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/Ñ/g, "N")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toLowerCase()
      .trim();

    const exists: boolean = await this.productExists(normalizedName);

    if (exists) {
      throw new Error(`El producto ${product.name} ya existe`);
    }

    try {
      const user = this.auth.currentUser;

      if (user) {
        product.name = normalizedName;
        product.createdBy = user.uid;
        product.createdAt = Timestamp.now();
        product.updatedBy = user.uid;
        product.updatedAt = Timestamp.now();
      }

      const docRef = await addDoc(this.productsCollection, product);

      if (imageFile) {
        const imageURL = await this.uploadImage(docRef.id, imageFile);
        await this.updateProductWithImage(docRef.id, imageURL);
      }

    } catch (e) {
      console.error('ERROR! al registrar el producto.', e);
      throw e;
    }
  }

  /** UPDATE PRODUCT **/
  async updateProduct(id: string, product: Partial<Product>, imageFile?: File): Promise<void> {
    // @ts-ignore
    const normalizedName = product.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/Ñ/g, "N")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toLowerCase()
      .trim();

    const exists: boolean = await this.productExists(normalizedName);

    if (exists) {
      throw new Error(`El producto ${product.name} ya existe`);
    }

    try {
      const user = this.auth.currentUser;

      if (user) {
        product.name = normalizedName;
        product.updatedBy = user.uid;
        product.updatedAt = Timestamp.now();
      }

      if (imageFile) {
        product.imageUrl = await this.uploadImage(id, imageFile);
      }

      const productDoc = doc(this.firestore, `products/${id}`);
      await updateDoc(productDoc, product);

    } catch (e) {
      console.error('ERROR! al actualizar el producto.', e);
      throw e;
    }
  }

  /** DELETE PRODUCT **/
  async deleteProduct(productId: string): Promise<void> {
    try {
      const productDocRef = doc(this.firestore, `products/${productId}`);
      const productSnapshot = await getDoc(productDocRef);
      if (!productSnapshot.exists()) {
        throw new Error('El producto no existe.');
      }
      const productData = productSnapshot.data() as Product;
      // Delete image from storage if exists
      if (productData.imageUrl) {
        await this.deleteImage(productId, productData.imageUrl);
      }
      // Delete product from Firestore
      await deleteDoc(productDocRef);
    } catch (error) {
      console.error('ERROR! al eliminar el producto.', error);
      throw error;
    }
  }

  /** UPLOAD IMAGE **/
  private async uploadImage(productId: string, file: File): Promise<string> {
    try {
      if (!file) {
        throw new Error('El archivo es nulo o indefinido.');
      }

      const maxFileSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxFileSize) {
        throw new Error('El tamaño del archivo excede el límite de 5MB.');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`El tipo de archivo ${file.type} no es permitido. Tipos aceptados: JPEG, PNG, GIF, WEBP.`);
      }

      const uniqueName = `${new Date().getTime()}-${file.name}`;
      const filePath = `products/${productId}/${uniqueName}`;
      const storageRef = ref(this.storage, filePath);

      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error(`Error al subir la imagen del producto ${productId}:`, error);
      throw error;
    }
  }

  /** DELETE IMAGE **/
  async fileExists(filePath: string): Promise<boolean> {
    const storageRef = ref(this.storage, filePath);
    try {
      await getMetadata(storageRef);
      return true;
    } catch (error) {
      // @ts-ignore
      if (error.code === 'storage/object-not-found') {
        return false;
      }
      throw error;
    }
  }

  async cleanUpProductReference(productId: string): Promise<void> {
    const productDoc = doc(this.firestore, `products/${productId}`);
    await updateDoc(productDoc, {imageUrl: null});
  }

  async deleteImage(productId: string, imageUrl: string): Promise<void> {
    const filePath = `products/${productId}`;
    const storageRef = ref(this.storage, filePath);
    try {
      const exists = await this.fileExists(filePath);
      if (!exists) {
        console.warn(`El archivo en la ruta ${filePath} no existe.`);
        await this.cleanUpProductReference(productId);
        return;
      }
      await deleteObject(storageRef);
    } catch (error) {
      console.error('ERROR! al eliminar la imagen.', error);
      throw error;
    }
  }

  /** UPLOAD PRODUCT WITH IMAGE **/
  private async updateProductWithImage(productId: string, imageURL: string): Promise<void> {
    try {
      const productDocRef = doc(this.firestore, `products/${productId}`);
      await updateDoc(productDocRef, {imageUrl: imageURL});
    } catch (error) {
      console.error('ERROR! al actualizar el producto con la url de la imagen.', error);
      throw error;
    }
  }
}
