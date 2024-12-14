import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonButton,
  IonText,
  IonCardTitle,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DrinkService } from 'src/app/shared/services/drink.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DrinkDb } from 'src/app/shared/interfaces/drink.interfaces';
import { CartService } from 'src/app/shared/services/cart.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-details-drink',
  templateUrl: './details-drink.page.html',
  styleUrls: ['./details-drink.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonCardTitle,
    IonText,
    IonButton,
    IonCard,
    IonContent,
    CommonModule,
    FormsModule,
  ],
})
export class DetailsDrinkPage implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _authService = inject(AuthService);
  private _drinkService = inject(DrinkService);
  private _router = inject(Router);
  // private _toast = inject(ToastService);
  private _cartService = inject(CartService);
  private _toastController = inject(ToastController);

  params = {
    id: '',
    backUrl: '',
  };

  drink: DrinkDb | null = null;
  userId: string | null = null;
  precioUnitario: number = 0;
  precioTotal: number = this.precioUnitario;
  quantity: number = 1;
  addToCartLoading = false;

  onPriceChange() {
    if (this.precioUnitario !== null) {
      this.precioTotal = this.precioUnitario * this.quantity;
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
    this._drinkService.gettingDrinkWithId(this.params.id).subscribe({
      next: (data) => {
        this.drink = data;
        this.precioUnitario = this.drink.precio;
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
    if (!this.userId) {
      //  await     this._toast.getToast(
      //         'Iniciar sesion para agregar al carrito',
      //         'middle',
      //         'warning'
      //       );

      const toast = await this._toastController.create({
        message: 'Iniciar sesion para agregar al carrito',
        duration: 1500,
        color: 'warning',
        position: 'bottom',
      });

      await toast.present();

      return;
    }
    if (!this.drink) return;

    try {
      this.addToCartLoading = true;

      await this._cartService.addToCart({
        cantidad: this.quantity,
        idItem: this.drink.id,
        descuento: 0.0,
        idUser: this.userId,
        imagen: this.drink.image,
        nombre: this.drink.nombre,
        precioTotal: this.precioTotal,
        precioUnidad: this.precioUnitario,
      });

      this.addToCartLoading = false;
    } catch (error) {
      this.addToCartLoading = false;
      console.log(error);
      // await this._toast.getToast('Error al añadir', 'middle', 'warning');
      const toast = await this._toastController.create({
        message: 'Error al añadir',
        duration: 1500,
        position: 'bottom',
        color: 'warning',
      });

      await toast.present();
    }
  }
}
