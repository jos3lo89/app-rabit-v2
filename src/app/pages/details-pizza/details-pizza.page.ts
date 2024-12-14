import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonButton,
  IonContent,
  IonText,
  IonCardTitle,
  IonCardHeader,
  IonSelectOption,
  IonSelect,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PizzaService } from 'src/app/shared/services/pizza.service';
import { PizzaDb } from 'src/app/shared/interfaces/pizza.interfaces';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { Cart, PizzaDetails } from 'src/app/shared/interfaces/cart.interfaces';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-details-pizza',
  templateUrl: './details-pizza.page.html',
  styleUrls: ['./details-pizza.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonCardHeader,
    IonCardTitle,
    IonText,
    IonContent,
    IonButton,
    IonCard,
    CommonModule,
    FormsModule,
    IonSelectOption,
    IonSelect,
  ],
})
export class DetailsPizzaPage implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _authService = inject(AuthService);
  private _pizzaService = inject(PizzaService);
  private _router = inject(Router);
  // private _toast = inject(ToastService);
  private _cartService = inject(CartService);
  // private _toastController   = inject(ToastController)
  private _toastController = inject(ToastController);

  params = {
    id: '',
    backUrl: '',
  };

  selectedCombination: string[] = []; // Para Duo o Cuatro Estaciones
  onCombinationChange(index: number, value: string) {
    this.selectedCombination[index] = value;
  }

  async validateCombination() {
    const uniqueItems = new Set(this.selectedCombination);
    if (uniqueItems.size !== this.selectedCombination.length) {
      //  await     this._toast.getToast(
      //         'Por favor, selecciona diferentes opciones.',
      //         'middle',
      //         'danger'
      //       );

      const toast = await this._toastController.create({
        message: 'Por favor, selecciona diferentes opciones',
        color: 'danger',
        position: 'bottom',
      });

      await toast.present();
      // const toast = await this._toastController

      return false;
    }
    return true;
  }

  opcionesDuo = ['Hawaiana', 'Pepperoni', 'Americana'];
  opcionesCuatroEstaciones = [
    'Hawaiana',
    'Pepperoni',
    'Americana',
    'Veguie',
    'Frutas',
    'Rabi Champi',
  ];

  pizza: PizzaDb | null = null;
  userId: string | null = null;
  tamanoSeleccionado: string = 'familiar';
  precioUnitario: number = 0;
  precioTotal: number = this.precioUnitario;
  quantity: number = 1;
  tipoSeleccionado: string = 'salada';
  masaSeleccionada: string = 'clasica';
  addToCartLoading = false;
  descuento: number = 0;
  precioConDescuento: number = 0;
  precioConDescuentoTotal: number = 0;
  precioProductoCondes = 0;

  onTipoChange(event: any) {
    this.tipoSeleccionado = event.detail.value;
  }

  onMasaChange(event: any) {
    this.masaSeleccionada = event.detail.value;
  }

  onTamanoChange(event: any) {
    this.tamanoSeleccionado = event.detail.value;

    this.tamanoSeleccionado = event.detail.value;

    if (this.tamanoSeleccionado === 'familiar' && this.pizza) {
      this.precioUnitario = this.pizza.tamanosPrecios.familiar;
    }
    if (this.tamanoSeleccionado === 'mediana' && this.pizza) {
      this.precioUnitario = this.pizza.tamanosPrecios.mediana;
    }
    if (this.tamanoSeleccionado === 'personal' && this.pizza) {
      this.precioUnitario = this.pizza.tamanosPrecios.personal;
    }

    this.onPriceChange();
  }

  onPriceChange() {
    if (this.precioUnitario !== null) {
      this.precioTotal = this.precioUnitario * this.quantity;
      this.precioConDescuento = this.precioUnitario * this.descuento; // 99.99
      this.precioProductoCondes = this.precioUnitario - this.precioConDescuento;
      this.precioConDescuentoTotal =
        (this.precioUnitario - this.precioConDescuento) * this.quantity; // 233.1
      // this.precioFinalTotal =
    }
  }

  increaseQuantity() {
    if (this.quantity < 10) {
      this.quantity++;
      this.onPriceChange();
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.onPriceChange();
    }
  }

  constructor() {
    addIcons({ arrowBackOutline });

    this._activatedRoute.queryParams.subscribe((param) => {
      if (param['id']) {
        this.params.id = param['id'];
        this.params.backUrl = param['backUrl'];
      }
    });

    this._authService.authState$.subscribe({
      next: (data) => {
        if (data) {
          this.userId = data.uid;
        }
      },
    });
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    this._pizzaService.gettingPizzaWithId(this.params.id).subscribe({
      next: (data) => {
        this.descuento = Number(data.descuento);

        this.pizza = data;
        this.precioUnitario = this.pizza.tamanosPrecios.familiar;

        this.precioConDescuento = this.precioUnitario * this.descuento;

        // console.log(this.precioConDescuento, this.precioUnitario);

        this.onPriceChange();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  pushRouter() {
    this._router.navigateByUrl(`/${this.params.backUrl}`);
  }

  async addToCart() {
    if (
      (this.pizza?.opciones.esDuo && this.selectedCombination.length !== 2) ||
      (this.pizza?.opciones.esCuatroEstaciones &&
        this.selectedCombination.length !== 4)
    ) {
      // await this._toast.getToast(
      //   'Por favor, selecciona todas las opciones requeridas.',
      //   'middle',
      //   'danger'
      // );

      const toast = await this._toastController.create({
        message: 'Por favor, selecciona todas las opciones requeridas',
        color: 'danger',
        position: 'middle',
        duration: 1000,
      });

      await toast.present();

      return;
    }

    if (!this.userId) {
      // await this._toast.getToast(
      //   'Iniciar sesion para agregar al carrito',
      //   'middle',
      //   'warning'
      // );

      const toast = await this._toastController.create({
        message: 'Iniciar sesion para agregar al carrito',
        color: 'warning',

        position: 'middle',
        duration: 1000,
      });

      await toast.present();

      return;
    }

    if (!this.pizza) {
      // await this._toast.getToast('fallo traer la pizza', 'middle', 'warning');
      const toast = await this._toastController.create({
        message: 'fallo traer la pizza',
        color: 'warning',
        duration: 1000,
        position: 'bottom',
      });

      await toast.present();

      return;
    }

    const pizzaDetail: PizzaDetails = {
      tamano: this.tamanoSeleccionado,
      masa: this.masaSeleccionada,
      sabor: this.tipoSeleccionado,
      esEntero:
        !this.pizza?.opciones.esDuo && !this.pizza?.opciones.esCuatroEstaciones,
      esDuo: this.pizza?.opciones.esDuo || false,
      esCuatroEstaciones: this.pizza?.opciones.esCuatroEstaciones || false,
    };

    if (pizzaDetail.esDuo || pizzaDetail.esCuatroEstaciones) {
      pizzaDetail.sabor = this.selectedCombination.join(' / ');
    }

    const cartItem: Cart = {
      // precioTotal: this.precioTotal,
      precioTotal:
        this.descuento !== 0.0
          ? this.precioConDescuentoTotal
          : this.precioTotal,

      // precioUnidad: this.precioUnitario,
      precioUnidad:
        this.descuento !== 0.0
          ? this.precioProductoCondes
          : this.precioUnitario,
      idUser: this.userId!,
      idItem: this.pizza!.id,
      nombre: this.pizza!.nombre,
      cantidad: this.quantity,
      imagen: this.pizza!.image,
      descuento: this.descuento,
      pizzaDetail,
    };

    try {
      this.addToCartLoading = true;

      await this._cartService.addToCart(cartItem);

      this.addToCartLoading = false;
    } catch (error) {
      console.log(error);
      this.addToCartLoading = false;
      // await this._toast.getToast('Error al añadir', 'middle', 'warning');
      const toast = await this._toastController.create({
        message: 'Error al añadir',
        position: 'bottom',
        color: 'warning',
        duration: 1000,
      });

      await toast.present();
    }
  }
}
