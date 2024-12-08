import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ExtrasService } from 'src/app/shared/services/extras.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ExtrasDb } from 'src/app/shared/interfaces/extras.interfaces';
import {
  IonText,
  IonContent,
  IonCard,
  IonButton,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { CartService } from 'src/app/shared/services/cart.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-details-extras',
  templateUrl: './details-extras.page.html',
  styleUrls: ['./details-extras.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonCardTitle,
    IonButton,
    IonCard,
    IonContent,
    IonText,
    CommonModule,
    FormsModule,
  ],
})
export class DetailsExtrasPage implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _authService = inject(AuthService);
  private _calzoneService = inject(ExtrasService);
  private _router = inject(Router);
  private _toast = inject(ToastService);
  private _cartService = inject(CartService);

  params = {
    id: '',
    backUrl: '',
  };

  extras: ExtrasDb | null = null;
  userId: string | null = null;
  precioUnitario: number = 0;
  precioTotal: number = this.precioUnitario;
  quantity: number = 1;
  addToCartLoading = false;

  async addToCart() {
    if (!this.userId) {
      this._toast.getToast(
        'Iniciar sesion para agregar al carrito',
        'middle',
        'warning'
      );

      return;
    }
    if (!this.extras) return;

    try {
      this.addToCartLoading = true;

      const result = await this._cartService.addToCart({
        cantidad: this.quantity,
        idItem: this.extras.id,
        descuento: 0.0,
        idUser: this.userId,
        imagen: this.extras.image,
        nombre: this.extras.nombre,
        precioTotal: this.precioTotal,
        precioUnidad: this.precioUnitario,
      });

      this.addToCartLoading = false;
    } catch (error) {
      console.log(error);
      this.addToCartLoading = false;
      this._toast.getToast('Error al añadir', 'middle', 'warning');
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
    this._calzoneService.gettingExtraWithId(this.params.id).subscribe({
      next: (data) => {
        this.extras = data;
        this.precioUnitario = this.extras.precio;
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
