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
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CalzoneService } from 'src/app/shared/services/calzone.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CalzoneDB } from 'src/app/shared/interfaces/calzone.interfaces';
import { CartService } from 'src/app/shared/services/cart.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-details-calzone',
  templateUrl: './details-calzone.page.html',
  styleUrls: ['./details-calzone.page.scss'],
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
export class DetailsCalzonePage implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _authService = inject(AuthService);
  private _calzoneService = inject(CalzoneService);
  private _router = inject(Router);
  private _toast = inject(ToastService);
  private _cartService = inject(CartService);

  params = {
    id: '',
    backUrl: '',
  };

  calzone: CalzoneDB | null = null;
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
    this._calzoneService.gettingCalzoneWithId(this.params.id).subscribe({
      next: (data) => {
        this.calzone = data;
        this.precioUnitario = this.calzone.precio;
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
      this._toast.getToast(
        'Iniciar sesion para agregar al carrito',
        'middle',
        'warning'
      );

      return;
    }
    if (!this.calzone) return;

    try {
      this.addToCartLoading = true;

      await this._cartService.addToCart({
        cantidad: this.quantity,
        idItem: this.calzone.id,
        descuento: 0.0,
        idUser: this.userId,
        imagen: this.calzone.image,
        nombre: this.calzone.nombre,
        precioTotal: this.precioTotal,
        precioUnidad: this.precioUnitario,
      });

      this.addToCartLoading = false;
    } catch (error) {
      this.addToCartLoading = false;
      console.log(error);
      this._toast.getToast('Error al añadir', 'middle', 'warning');
    }
  }
}
