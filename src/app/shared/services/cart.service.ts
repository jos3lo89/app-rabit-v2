import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Cart, CartDb, ProductoCart } from '../interfaces/cart.interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastService } from './toast.service';
import { EstadoMesa } from '../interfaces/mesa.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _fireStore = inject(Firestore);
  private _authService = inject(AuthService);
  private _toastService = inject(ToastService);

  private _collName = 'cart';
  private _isAuth = false;

  private _cartCount$ = new BehaviorSubject<number>(0);

  public readonly cartCount$ = this._cartCount$.asObservable();

  private _currentUserId = signal<string | null>(null);
  private _cartItems = signal<CartDb[]>([]);
  public cartCount: Signal<number> = computed(() => this._cartItems().length);

  constructor() {
    this._authService.authState$.subscribe({
      next: (data) => {
        if (data) {
          this._isAuth = true;
          this._currentUserId.set(data.uid);

          this.loadCartItems();
        } else {
          this._cartCount$.next(0);
          this._currentUserId.set(null);
          this._cartItems.set([]);
        }
      },
    });
  }

  getCollectionLength(): Observable<number> {
    const collRef = collection(this._fireStore, 'tickets');

    return new Observable((observer) => {
      getDocs(collRef)
        .then((qryShot) => {
          observer.next(qryShot.size);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  private async loadCartItems() {
    const userId = this._currentUserId();
    if (!userId) return;

    const collRef = collection(this._fireStore, 'cart');
    const q = query(collRef, where('idUser', '==', userId));

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CartDb[];

    this._cartItems.set(items);
  }

  async addToCart(data: Cart) {
    const userId = this._currentUserId();

    if (!this._isAuth || !userId) {
      return null;
    }

    const existingItem = await this.getCartItemByUserAndItem(
      userId,
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

    const collRef = collection(this._fireStore, this._collName);
    const newItem = await addDoc(collRef, {
      ...data,
      idUser: userId,
    });
    this.loadCartItems();

    await this._toastService.getToast(
      'Producto agregado a tu carrito.',
      'middle',
      'success'
    );

    return newItem;
  }

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

  async updateItemQuantity(
    idItem: string,
    idUser: string,
    action: 'increase' | 'decrease'
  ) {
    try {
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
        this.loadCartItems();
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
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

  async deleteCartItemInDb(item: CartDb) {
    try {
      const docRef = doc(this._fireStore, `${this._collName}/${item.id}`);
      await deleteDoc(docRef);
      this.loadCartItems();
    } catch (error) {
      console.error(
        'Error al eliminar el producto de la base de datos:',
        error
      );
      throw error;
    }
  }

  async clearCart(num_ticket: number, num_mesa: number, id_mesa: string) {
    const userId = this._currentUserId();

    if (!this._isAuth || !userId) {
      console.error('Usuario no autenticado o no válido.');
      return;
    }

    try {
      const cartItems = this._cartItems();

      await this.saveTicket(
        cartItems,
        cartItems.reduce((sum, item) => sum + item.precioTotal, 0),
        num_ticket,
        num_mesa
      );

      for (const item of cartItems) {
        const docRef = doc(this._fireStore, `${this._collName}/${item.id}`);
        await deleteDoc(docRef);
      }

      if (num_mesa !== 0) {
        await this.updateMesa(id_mesa);
      }

      this._cartItems.set([]);
      this._toastService.getToast(
        'Carrito vaciado exitosamente.',
        'middle',
        'success'
      );
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      this._toastService.getToast(
        'Ocurrió un error al vaciar el carrito.',
        'middle',
        'danger'
      );
    }
  }

  /* ============================================================= */

  async updateMesa(id: string) {
    try {
      const docREf = doc(this._fireStore, `mesas/${id}`);
      await updateDoc(docREf, { estado: EstadoMesa.EN_USO });
    } catch (error) {
      console.log(error);
    }
  }

  async saveTicket(
    products: CartDb[],
    totalAmount: number,
    num_ticket: number,
    num_mesa: number
  ) {
    const userId = this._currentUserId();

    if (!userId) {
      console.error('Usuario no autenticado o no válido.');
      return;
    }

    try {
      const collRef = collection(this._fireStore, 'tickets');
      const ticketData = {
        userId,
        products,
        totalAmount,
        date: new Date().toLocaleDateString(),
        num_ticket,
        num_mesa,
      };

      await addDoc(collRef, ticketData);

      this._toastService.getToast(
        'Ticket guardado en el historial.',
        'middle',
        'success'
      );
    } catch (error) {
      console.error('Error al guardar el ticket:', error);
      this._toastService.getToast(
        'Ocurrió un error al guardar el ticket.',
        'middle',
        'danger'
      );
    }
  }

  // async getTicketsByDateRange(startDate: string, endDate: string) {
  //   const userId = this._currentUserId();

  //   if (!userId) {
  //     console.error('Usuario no autenticado o no válido.');
  //     return [];
  //   }

  //   try {
  //     const collRef = collection(this._fireStore, 'tickets');
  //     const q = query(
  //       collRef,
  //       where('userId', '==', userId),
  //       where('date', '>=', startDate),
  //       where('date', '<=', endDate)
  //     );

  //     const querySnapshot = await getDocs(q);
  //     return querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //   } catch (error) {
  //     console.error('Error al obtener los tickets:', error);
  //     throw error;
  //   }
  // }

  async getTicketsByDate(date: string) {
    const userId = this._currentUserId();

    if (!userId) {
      console.error('Usuario no autenticado o no válido.');
      return [];
    }

    try {
      const collRef = collection(this._fireStore, 'tickets');
      const q = query(
        collRef,
        where('userId', '==', userId),
        // where('date', '>=', `${date}T00:00:00.000Z`),
        // where('date', '<=', `${date}T23:59:59.999Z`)
        where('date', '==', date)
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error al obtener tickets:', error);
      throw error;
    }
  }
}
