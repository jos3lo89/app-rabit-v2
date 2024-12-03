import { computed, inject, Injectable, Signal, signal } from '@angular/core';
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
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _fireStore = inject(Firestore);
  private _authService = inject(AuthService);
  private _toastController = inject(ToastController); // new added
  private _collName = 'cart';
  private _isAuth = false;
  private _currentUserId: string | null = null;

  private _toastService = inject(ToastService);

  private _cartCount$ = new BehaviorSubject<number>(0);

  public readonly cartCount$ = this._cartCount$.asObservable();

  /* ---------- signaal */
  private _currentUserId2 = signal<string | null>(null); // Usuario actual

  private _cartItems = signal<CartDb[]>([]);

  public cartCount: Signal<number> = computed(() => this._cartItems().length);

  /* ---------- signaal */

  constructor() {
    this._authService.authState$.subscribe({
      next: (data) => {
        if (data) {
          this._isAuth = true;
          this._currentUserId = data.uid; // Obtener el id del usuario autenticado
          this._currentUserId2.set(data.uid);

          this.loadCartItems(); // Cargar los ítems del carrito para el usuario actual
        } else {
          this._cartCount$.next(0); // Reinicia el contador al cerrar sesión
          this._currentUserId2.set(null);
          this._cartItems.set([]); // Vaciar el carrito si no hay usuario autenticado
        }
      },
    });
  }

  private async loadCartItems() {
    const userId = this._currentUserId2();
    if (!userId) return;

    const collRef = collection(this._fireStore, 'cart');
    const q = query(collRef, where('idUser', '==', userId));

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CartDb[];

    this._cartItems.set(items); // Actualizar señal con los ítems cargados
  }

  // Método para mostrar un Toast
  // private async showToast(message: string) {
  //   const toast = await this._toastController.create({
  //     message,
  //     duration: 2000,
  //     position: 'top',
  //   });
  //   await toast.present();
  // }

  async addToCart(data: Cart) {
    if (!this._isAuth || !this._currentUserId || !this._currentUserId2()) {
      console.log('Usuario no autenticado.');
      return null;
    }

    /* ------------------------- */
    const existingItem = await this.getCartItemByUserAndItem(
      this._currentUserId,
      data.idItem
    );

    if (existingItem) {
      await this._toastService.getToast(
        'El producto ya está agregado a tu carrito.',
        'middle',
        'tertiary'
      );
      return;
    }

    // Agregar nuevo producto al carrito
    const collRef = collection(this._fireStore, this._collName);
    const newItem = await addDoc(collRef, {
      ...data,
      idUser: this._currentUserId,
    });
    this.loadCartItems(); // Refrescar ítems después de agregar

    await this._toastService.getToast(
      'Producto agregado a tu carrito.',
      'middle',
      'success'
    );

    return newItem;
    /* ------------------------- */

    // const findItemWithId = await this.gettingCartItemWhitIdItem(data.idItem);

    // if (findItemWithId) {
    //   this.updateQuantityItemWithId(data.idItem);
    //   return;
    // }

    // const collRef = collection(this._fireStore, this._collName);
    // return await addDoc(collRef, data);
  }

  // Buscar producto en el carrito por usuario e id del producto
  private async getCartItemByUserAndItem(idUser: string, idItem: string) {
    try {
      const collRef = collection(this._fireStore, this._collName);
      const q = query(
        collRef,
        where('idUser', '==', idUser),
        where('idItem', '==', idItem),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty ? null : querySnapshot.docs[0];
    } catch (error) {
      console.error('Error al buscar producto:', error);
      throw error;
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  async updateItemQuantity(
    idItem: string,
    idUser: string,
    action: 'increase' | 'decrease'
  ) {
    const cartItem = await this.getCartItemByUserAndItem(idUser, idItem);

    if (cartItem) {
      const docRef = doc(this._fireStore, `${this._collName}/${cartItem.id}`);
      const currentData = cartItem.data();
      let newQuantity = currentData['cantidad'] || 0;

      if (action === 'increase') {
        newQuantity += 1;
      } else if (action === 'decrease' && newQuantity > 1) {
        newQuantity -= 1;
      }

      await updateDoc(docRef, { cantidad: newQuantity });
      console.log(`Cantidad actualizada: ${newQuantity}`);
    }
  }

  // Obtener todos los productos del carrito por usuario
  async getCartByUser(idUser: string) {
    try {
      const collRef = collection(this._fireStore, this._collName);
      const q = query(collRef, where('idUser', '==', idUser));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      throw error;
    }
  }

  /* ----------------------------------------------------- */

  // Eliminar un producto del carrito
  async deleteCartItem(idItem: string) {
    if (!this._currentUserId) {
      console.log('Usuario no autenticado.');
      return;
    }

    const cartItem = await this.getCartItemByUserAndItem(
      this._currentUserId,
      idItem
    );

    if (cartItem) {
      const docRef = doc(this._fireStore, `${this._collName}/${cartItem.id}`);
      await deleteDoc(docRef);
      this.loadCartItems(); // Refrescar ítems después de agregar

      console.log(`Producto eliminado: ${cartItem.id}`);
    }
  }

  /* ----------------------------------------- */

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
        this.loadCartItems(); // Refrescar ítems después de agregar
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

  async deleteCartItemMIO(idItem: string) {
    const collRef = doc(this._fireStore, `${this._collName}/${idItem}`);

    await deleteDoc(collRef);
    this.loadCartItems(); // Refrescar ítems después de agregar
  }

  cartQuantity(idUser: string): Observable<number> {
    const refCol = collection(this._fireStore, this._collName);
    const q = query(refCol, where('idUser', '==', idUser));

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const docsLength = querySnapshot.docs.length;
          this._cartCount$.next(docsLength);

          observer.next(docsLength);
        },
        (error) => {
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  async updateItemQuantityMIO(item: CartDb, action: 'increase' | 'decrease') {
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
      this.loadCartItems(); // Refrescar ítems después de agregar

      console.log(`Cantidad actualizada en Firestore: ${newQuantity}`);
    }
  }

  // Eliminar un producto del carrito en Firestore
  async deleteCartItemInDb(item: CartDb) {
    try {
      const docRef = doc(this._fireStore, `${this._collName}/${item.id}`);
      await deleteDoc(docRef);
      this.loadCartItems(); // Refrescar ítems después de agregar

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
