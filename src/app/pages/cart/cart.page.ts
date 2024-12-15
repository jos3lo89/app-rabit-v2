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
  IonSelect,
  IonSelectOption,
  ToastController,
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
import { AlertController } from '@ionic/angular/standalone';
import { MesasService } from 'src/app/shared/services/mesas.service';
import { EstadoMesa, MesaDb } from 'src/app/shared/interfaces/mesa.interfaces';
import { DetallesMesaService } from 'src/app/shared/services/detalles-mesa.service';
import { EntregaMesa } from 'src/app/shared/interfaces/detallesMesa.interfaces';

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
    IonSelect,
    IonSelectOption,
  ],
})
export class CartPage implements OnInit {
  private _authService = inject(AuthService);
  private _cartService = inject(CartService);
  private _pdfService = inject(PdfService);
  private _alertController = inject(AlertController);
  private _tostController = inject(ToastController);
  private _mesaService = inject(MesasService);
  private _detallesMesaService = inject(DetallesMesaService);

  currentUser: User | null = null;
  cartItems: CartDb[] | null = null;
  isUpdating: boolean = false;
  precioTotalFinal: number | null = null;
  mesas: null | MesaDb[] = null;
  num_ticket: number | null = null;
  id_mesa: string | null = null;

  onMesaChange(event: any) {
    this.id_mesa = event.detail.value;
    console.log('Mesa seleccionada:', this.id_mesa);
  }

  pushRouter(route: string) {
    console.log(route);
  }

  constructor() {
    addIcons({ addCircleOutline, removeCircleOutline, trashOutline });
  }

  ngOnInit() {}

  gettingMesas() {
    this._mesaService.gettingMesas().subscribe({
      next: (data) => {
        this.mesas = data
          .filter((mesa) => mesa.estado == EstadoMesa.ACTIVO)
          .sort((a, b) => a.num_mesa - b.num_mesa);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getCollLength() {
    this._cartService.getCollectionLength().subscribe({
      next: (data) => {
        this.num_ticket = data + 1;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  async ionViewWillEnter() {
    this.getCollLength();

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
    this.gettingMesas();
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

    if (!this.id_mesa) {
      const tost = await this._tostController.create({
        message: 'Selecione una mesa',
        position: 'middle',
        duration: 1500,
        color: 'warning',
      });

      await tost.present();

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
            if (!this.cartItems || !this.precioTotalFinal || !this.num_ticket)
              return;

            if (this.id_mesa && this.mesas) {
              const id_mesita = this.mesas.find(
                (mesa) => mesa.id === this.id_mesa
              );

              if (!id_mesita) {
                console.log('si hay mesita');

                return;
              }

              await this._pdfService.generarBoleta(
                this.cartItems,
                this.precioTotalFinal,
                id_mesita.num_mesa,
                this.num_ticket
              );

              const mesa = await this.getMesa(this.id_mesa);

              await this._cartService.clearCart(
                this.num_ticket,
                mesa.num_mesa,
                mesa.id
              );

              // aqui mandar al mes detalles
              // const mesaDetalles = {
              //   id_mesa : mesa.id,
              // }

              await this._detallesMesaService.addDetails({
                productos: this.cartItems,
                id_mesa: mesa.id,
                entrega: EntregaMesa.PENDIENTE,
              });
            }

            if (this.currentUser) {
              this.loadCartItems(this.currentUser.uid);
              this.id_mesa = null;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  getMesa(id: string) {
    return this._mesaService.getMesa(id);
  }
}
