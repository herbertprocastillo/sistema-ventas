import {inject, Injectable} from '@angular/core';
import {collection, collectionData, Firestore, Timestamp} from '@angular/fire/firestore';
import {combineLatest, Observable} from 'rxjs';
import {Movement} from '../interfaces/warehouse';
import {Product} from '../../products/interfaces/product';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private firestore = inject(Firestore);

  private movementsCollection = collection(this.firestore, 'warehousesMovements');
  private productsCollection = collection(this.firestore, 'products');

  // Obtener movimientos desde Firestore
  getMovements(): Observable<Movement[]> {
    return collectionData(this.movementsCollection, { idField: 'id' }) as Observable<Movement[]>;
  }

  // Obtener productos desde Firestore
  getProducts(): Observable<Product[]> {
    return collectionData(this.productsCollection, { idField: 'id' }) as Observable<Product[]>;
  }

  // Calcular inventario
  getInventory(): Observable<{ product: Product; stock: number }[]> {
    return combineLatest([this.getMovements(), this.getProducts()]).pipe(
      map(([movements, products]) => {
        // Calcular el stock agrupando movimientos por producto
        const stockMap = movements.reduce((acc, movement) => {
          const productId = movement.product_id;
          const quantity = movement.type === 'INGRESO' ? movement.quantity : -movement.quantity;

          if (!acc[productId]) {
            acc[productId] = 0;
          }
          acc[productId] += quantity;
          return acc;
        }, {} as Record<string, number>);

        // Crear el listado de productos con stock positivo
        return products
          .filter(product => stockMap[product.id!] > 0) // Filtrar solo productos con stock positivo
          .map(product => ({
            product,
            stock: stockMap[product.id!], // Obtener el stock del producto
          }));
      })
    );
  }
}
