import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RollsService } from 'src/app/shared/services/rolls.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { RollsDb } from 'src/app/shared/interfaces/rolls.interface';
import {
  IonContent,
  IonCard,
  IonButton,
  IonText,
  IonCardTitle,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { CartService } from 'src/app/shared/services/cart.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-details-rolls',
  templateUrl: './details-rolls.page.html',
  styleUrls: ['./details-rolls.page.scss'],
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
export class DetailsRollsPage implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _authService = inject(AuthService);
  private _rollsService = inject(RollsService);
  private _router = inject(Router);
  // private _toast = inject(ToastService);
  private _toastContrller = inject(ToastController);
  private _cartService = inject(CartService);

  params = {
    id: '',
    backUrl: '',
  };

  roll: RollsDb | null = null;
  userId: string | null = null;
  precioUnitario: number = 0;
  precioTotal: number = this.precioUnitario;
  quantity: number = 1;
  addToCartLoading = false;

  async addToCart() {
    if (!this.userId) {
      //  await     this._toast.getToast(
      //         'Iniciar sesion para agregar al carrito',
      //         'middle',
      //         'warning'
      //       );

      const toast = await this._toastContrller.create({
        message: 'Iniciar sesion para agregar al carrito',
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();

      return;
    }
    if (!this.roll) return;

    try {
      this.addToCartLoading = true;

      await this._cartService.addToCart({
        cantidad: this.quantity,
        idItem: this.roll.id,
        descuento: 0.0,
        idUser: this.userId,
        imagen: this.roll.image,
        nombre: this.roll.nombre,
        precioTotal: this.precioTotal,
        precioUnidad: this.precioUnitario,
      });

      this.addToCartLoading = false;
    } catch (error) {
      this.addToCartLoading = false;
      console.log(error);
      // await this._toast.getToast('Error al añadir', 'middle', 'warning');
      const toast = await this._toastContrller.create({
        message: 'Error al añadir',
        position: 'bottom',
        color: 'warning',
      });

      await toast.present();
    }
  }

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
    this._rollsService.gettingRollWithId(this.params.id).subscribe({
      next: (data) => {
        this.roll = data;
        this.precioUnitario = this.roll.precio;
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
}
