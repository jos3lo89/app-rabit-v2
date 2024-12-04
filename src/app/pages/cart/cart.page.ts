import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonButton,
  IonText,
  IonLabel,
  IonIcon,
  IonSpinner,
  IonThumbnail,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { CartService } from 'src/app/shared/services/cart.service';
import { CartDb } from 'src/app/shared/interfaces/cart.interfaces';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  removeCircleOutline,
  trashOutline,
} from 'ionicons/icons';
import { PdfService } from 'src/app/shared/services/pdf.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonIcon,
    IonLabel,
    IonText,
    IonButton,
    IonCard,
    IonContent,
    CommonModule,
  ],
})
export class CartPage implements OnInit {
  private _authService = inject(AuthService);
  private _cartService = inject(CartService);
  private _pdfService = inject(PdfService);
  private _alertController = inject(AlertController);

  currentUser: User | null = null;
  cartItems: CartDb[] | null = null;
  isUpdating: boolean = false;
  precioTotalFinal: number | null = null;

  pushRouter(route: string) {
    console.log(route);
  }

  constructor() {
    addIcons({ addCircleOutline, removeCircleOutline, trashOutline });
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    this._authService.authState$.subscribe({
      next: (data) => {
        this.currentUser = data;
        if (this.currentUser) {
          this.loadCartItems(this.currentUser.uid);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private loadCartItems(userId: string) {
    this._cartService.gettingCartWithUserid(userId).subscribe({
      next: (data) => {
        this.cartItems = data.map((item) => ({
          ...item,
          precioTotal: item.precioUnidad * item.cantidad,
        }));
        this.calcularPrecioTotal();
      },
      error: (error) =>
        console.error('Error al cargar ítems del carrito:', error),
    });
  }

  async updateQuantity(item: CartDb, action: 'increase' | 'decrease') {
    if (this.isUpdating) return;
    this.isUpdating = true;

    try {
      if (action === 'increase') {
        item.cantidad++;
      } else if (action === 'decrease' && item.cantidad > 1) {
        item.cantidad--;
      }

      item.precioTotal = item.precioUnidad * item.cantidad;
      this.calcularPrecioTotal();
      await this._cartService.updateItemQuantity(
        item.idItem,
        item.idUser,
        action
      );
    } catch (error) {
      console.error('Error al actualizar la cantidad en Firestore:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  async removeItem(item: CartDb) {
    if (!this.cartItems) return;

    const alert = await this._alertController.create({
      header: 'Confirmar acción',
      message: '¿Estás seguro de que quieres eliminar el producto del carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Acción cancelada por el usuario.');
          },
        },
        {
          text: 'Aceptar',
          handler: async () => {
            this._cartService.deleteCartItemInDb(item);
            if (this.cartItems) {
              this.cartItems = this.cartItems.filter(
                (cartItem) => cartItem.id !== item.id
              );
            }
            this.calcularPrecioTotal();
          },
        },
      ],
    });

    await alert.present();
  }

  calcularPrecioTotal() {
    if (this.cartItems) {
      this.precioTotalFinal = this.cartItems.reduce(
        (acumulador, producto) => acumulador + producto.precioTotal,
        0
      );
    }
  }

  async continueShopping() {
    if (!this.cartItems || !this.precioTotalFinal) {
      console.warn('El carrito está vacío o no hay precio total.');
      return;
    }

    const alert = await this._alertController.create({
      header: 'Confirmar acción',
      message:
        '¿Estás seguro de que quieres imprimir el ticket y vaciar el carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Acción cancelada por el usuario.');
          },
        },
        {
          text: 'Aceptar',
          handler: async () => {
            if (!this.cartItems || !this.precioTotalFinal) return;
            this._pdfService.generarBoleta({
              producto: this.cartItems,
              totalPagar: this.precioTotalFinal,
            });

            await this._cartService.clearCart();
            if (this.currentUser) {
              this.loadCartItems(this.currentUser.uid);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
