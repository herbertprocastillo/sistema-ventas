import {Injectable} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User} from '@angular/fire/auth';
import {
  collection,
  collectionData, deleteDoc,
  doc,
  docData,
  Firestore,
  setDoc,
  Timestamp,
  updateDoc
} from '@angular/fire/firestore';
import {User as AppUser} from '../../users/interfaces/user';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {
  }

  /** ********************************************************************* **/
  /** Obtener el usuario actualmente autenticado en Firebase Authentication **/
  public getCurrentUser(): User | null {
    return this.auth.currentUser;
  }


  /** ************************************************************** **/
  /** Obtener datos de Firestore del usuario actualmente autenticado **/
  getCurrentUserDataFirestore(): Observable<any> | null {
    const user = this.getCurrentUser();
    if (user) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      return docData(userDocRef);
    }
    return null;
  }


  /** **************************** **/
  /******** Iniciar sesión **********/
  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }


  /** *************************** **/
  /******** Cerrar sesión **********/
  async logout() {
    return await signOut(this.auth);
  }


  /** *********************************************** **/
  /** Registrar usuario en Authentication & Firestore **/
  async addUser(adminEmail: string, adminPassword: string, email: string, password: string, displayName: string, role: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      const currentUser = this.getCurrentUser();

      await setDoc(doc(this.firestore, 'users', uid), {
        id: uid,
        email,
        displayName,
        role,
        createdBy: currentUser ? currentUser.uid : null,
        createdAt: Timestamp.now(),
        updatedBy: currentUser ? currentUser.uid : null,
        updatedAt: Timestamp.now()
      } as AppUser);

      await signInWithEmailAndPassword(this.auth, adminEmail, adminPassword);

    } catch (error) {
      console.error('Error al registrar al nuevo usuario', error);
      throw error;
    }
  }


  /** ************************************************* **/
  /****** Obtener todos los usuarios desde Firestore *****/
  getAllUsers(): Observable<AppUser[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, {idField: 'id'}) as Observable<AppUser[]>;
  }

  /** ************************************************* **/
  /****** Obtener usuario por el Id desde Firestore ******/
  getUser(uid: string): Observable<AppUser | undefined> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return docData(userDoc) as Observable<AppUser | undefined>;
  }


  /** ****************************************** **/
  /****** Actualizar un usuario en Firestore ******/
  async updateUser(uid: string, data: Partial<AppUser>) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    const currentUser = this.getCurrentUser();
    return await updateDoc(userDoc, {
      ...data,
      updatedBy: currentUser ? currentUser.uid : null,
      updatedAt: Timestamp.now()
    });
  }


  /** **************************************** **/
  /****** Eliminar un usuario en Firestore ******/
  async deleteUser(uid: string) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return await deleteDoc(userDoc);
  }
}
