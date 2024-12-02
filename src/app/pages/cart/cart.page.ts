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
    IonThumbnail,
  ],
})
export class CartPage implements OnInit {
  private _authService = inject(AuthService);
  private _cartService = inject(CartService);
  private _pdfService = inject(PdfService);

  currentUser: User | null = null;
  cartItems: CartDb[] | null = null;
  isUpdating: boolean = false;
  precioTotalFinal: number | null = null;

  constructor() {
    addIcons({ addCircleOutline, removeCircleOutline, trashOutline });
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    this._authService.authState$.subscribe({
      next: (data) => {
        this.currentUser = data;
        if (this.currentUser) {
          this._cartService
            .gettingCartWithUserid(this.currentUser.uid)
            .subscribe({
              next: (data) => {
                console.log(data);
                this.cartItems = data.map((item) => {
                  return {
                    ...item,
                    precioTotal: item.precioUnidad * item.cantidad,
                  };
                });
                this.calcularPrecioTotal();
              },
              error: (error) => {
                console.log(error);
              },
            });
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  async updateQuantity(item: CartDb, action: 'increase' | 'decrease') {
    if (this.isUpdating) return;
    this.isUpdating = true;

    if (action === 'increase') {
      item.cantidad++;
    } else if (action === 'decrease' && item.cantidad > 1) {
      item.cantidad--;
    }

    item.precioTotal = item.precioUnidad * item.cantidad;
    this.calcularPrecioTotal();
    try {
      await this._cartService.updateItemQuantity(item, action);
    } catch (error) {
      console.error('Error al actualizar la cantidad en Firestore:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  removeItem(item: CartDb) {
    if (!this.cartItems) return;

    this._cartService.deleteCartItemInDb(item);

    this.cartItems = this.cartItems.filter(
      (cartItem) => cartItem.id !== item.id
    );

    this.calcularPrecioTotal();
  }

  calcularPrecioTotal() {
    if (this.cartItems) {
      this.precioTotalFinal = this.cartItems.reduce(
        (acumulador, producto) => acumulador + producto.precioTotal,
        0
      );
    }
  }

  continueShopping() {
    if (!this.cartItems || !this.precioTotalFinal) {
      return;
    }

    this._pdfService.generarBoleta({
      producto: this.cartItems,
      totalPagar: this.precioTotalFinal,
    });
  }
}
