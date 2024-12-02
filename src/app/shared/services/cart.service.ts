import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Cart, CartDb } from '../interfaces/cart.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _fireStore = inject(Firestore);
  private _authService = inject(AuthService);
  private _collName = 'cart';
  private _isAuth = false;

  constructor() {
    this._authService.authState$.subscribe({
      next: (data) => {
        if (data) {
          this._isAuth = true;
        }
      },
    });
  }

  async addToCart(data: Cart) {
    if (!this._isAuth) return null;

    const findItemWithId = await this.gettingCartItemWhitIdItem(data.idItem);

    if (findItemWithId) {
      this.updateQuantityItemWithId(data.idItem);
      return;
    }

    const collRef = collection(this._fireStore, this._collName);
    return await addDoc(collRef, data);
  }

  async updateQuantityItemWithId(idItem: string) {
    try {
      const collRef = collection(this._fireStore, this._collName);
      const q = query(collRef, where('idItem', '==', idItem), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const docRef = doc(this._fireStore, this._collName, docSnap.id);

        const currentData = docSnap.data();
        const newQuantity = (currentData['cantidad'] || 0) + 1;

        await updateDoc(docRef, { cantidad: newQuantity });
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
      throw error;
    }
  }

  async gettingCartItemWhitIdItem(idItem: string) {
    try {
      const collRef = collection(this._fireStore, this._collName);

      const q = query(collRef, where('idItem', '==', idItem), limit(1));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        return { id: docSnapshot.id, ...docSnapshot.data() };
      } else {
        console.log('No se encontró ningún documento con ese idItem.');
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo el documento:', error);
      throw error;
    }
  }

  gettingCartWithUserid(idUser: string): Observable<CartDb[]> {
    const collRef = collection(this._fireStore, this._collName);

    const q = query(collRef, where('idUser', '==', idUser));

    return new Observable((observer) => {
      getDocs(q)
        .then((qrySnapShot) => {
          const items = qrySnapShot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as CartDb;
          });

          observer.next(items);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  async deleteCartItem(idItem: string) {
    const collRef = doc(this._fireStore, `${this._collName}/${idItem}`);

    await deleteDoc(collRef);
  }

  cartQuantity(idUser: string): Observable<number> {
    const refCol = collection(this._fireStore, this._collName);
    const q = query(refCol, where('idUser', '==', idUser));

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const docsLength = querySnapshot.docs.length;
          observer.next(docsLength);
        },
        (error) => {
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  async updateItemQuantity(item: CartDb, action: 'increase' | 'decrease') {
    const collRef = collection(this._fireStore, this._collName);
    const q = query(collRef, where('idItem', '==', item.idItem), limit(1));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const docRef = doc(this._fireStore, this._collName, docSnap.id);

      const currentData = docSnap.data();
      let newQuantity = currentData['cantidad'] || 0;

      // Aumentar o disminuir la cantidad según la acción
      if (action === 'increase') {
        newQuantity += 1;
      } else if (action === 'decrease' && newQuantity > 1) {
        newQuantity -= 1;
      }

      // Actualizar la cantidad en la base de datos
      await updateDoc(docRef, { cantidad: newQuantity });
      console.log(`Cantidad actualizada en Firestore: ${newQuantity}`);
    }
  }

  // Eliminar un producto del carrito en Firestore
  async deleteCartItemInDb(item: CartDb) {
    try {
      const docRef = doc(this._fireStore, `${this._collName}/${item.id}`);
      await deleteDoc(docRef);
      console.log(`Producto eliminado, idItem: ${item.id}`);
    } catch (error) {
      console.error(
        'Error al eliminar el producto de la base de datos:',
        error
      );
      throw error;
    }
  }
}
