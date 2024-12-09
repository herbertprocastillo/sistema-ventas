import {inject, Injectable} from '@angular/core';
import {Auth, User, updateEmail, updatePassword, deleteUser} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {collection, collectionData, CollectionReference, doc, docData, Firestore} from '@angular/fire/firestore';
import {User as AppUser} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /** INJECTS **/
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  /** COLLECTIONS **/
  private readonly userCollection: CollectionReference = collection(this.firestore, 'users');

  getUsers(): Observable<AppUser[]> {
    return collectionData(this.userCollection, {idField: 'id'}) as Observable<AppUser[]>;
  }

  /** ***************************** **/
  /** Obtener el usuario por el id **/
  getUserById(uid: string): Observable<AppUser> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef) as Observable<AppUser>;
  }

  /** ****************************************** **/
  /** Obtener el usuario actualmente autenticado **/
  private getCurrentUser(): User | null {
    return this.auth.currentUser;
  }


  /** *********************************************************** **/
  /** Actualizar el correo del usuario en Firebase Authentication **/
  async updateEmail(newEmail: string): Promise<void> {
    const user = this.getCurrentUser();
    if (user) {
      try {
        await updateEmail(user, newEmail);
        console.log('Correo actualizado correctamente.');
      } catch (error) {
        console.error('Error al actualizar el correo:', error);
        throw error;
      }
    } else {
      throw new Error('No hay un usuario autenticado.');
    }
  }


  /** **************************************************************** **/
  /** Actualizar la contraseña del usuarrio en Firebase Authentication **/
  async updatePassword(newPassword: string): Promise<void> {
    const user = this.getCurrentUser();
    if (user) {
      try {
        await updatePassword(user, newPassword);
        console.log('Contraseña actualizada correctamente.');
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        throw error;
      }
    } else {
      throw new Error('No hay un usuario autenticado.');
    }
  }


  /** ******************************************************** **/
  /** Eliminar la cuenta de usuario en Firebase Authentication **/
  async deleteCurrentUser(): Promise<void> {
    const user = this.getCurrentUser();
    if (user) {
      try {
        await deleteUser(user);
        console.log('Usuario eliminado correctamente.');
      } catch (error) {
        console.error('Error al eliminar al usuario:', error);
        throw error;
      }
    } else {
      throw new Error('No hay un usuario autenticado.');
    }
  }
}
