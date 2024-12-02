import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonButton, IonText, IonCardTitle } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RollsService } from 'src/app/shared/services/rolls.service';
import { CalzoneService } from 'src/app/shared/services/calzone.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CalzoneDB } from 'src/app/shared/interfaces/calzone.interfaces';
import { CartService } from 'src/app/shared/services/cart.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-details-calzone',
  templateUrl: './details-calzone.page.html',
  styleUrls: ['./details-calzone.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonText, IonButton, IonCard, IonContent,  CommonModule, FormsModule],
})
export class DetailsCalzonePage implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _authService = inject(AuthService);
  private _calzoneService = inject(CalzoneService);
  private _router = inject(Router);
  private _toast = inject(ToastService);
  private _cartService = inject(CartService);
  private _loadingService = inject(LoadingService);

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
        console.log(data);
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

    const loading = await this._loadingService.loading();
    await loading.present();

    try {
      this.addToCartLoading = true;

      const result = await this._cartService.addToCart({
        cantidad: this.quantity,
        idItem: this.calzone.id,
        descuento: 0.0,
        idUser: this.userId,
        imagen: this.calzone.image,
        nombre: this.calzone.nombre,
        precioTotal: this.precioTotal,
        precioUnidad: this.precioUnitario,
      });

      if (!result) {
        this._toast.getToast('Error al añadir null', 'middle', 'warning');
      }

      this._toast.getToast('Calzone agregado al carrito', 'middle', 'success');

      this.addToCartLoading = false;
    } catch (error) {
      this.addToCartLoading = false;
      console.log(error);
      this._toast.getToast('Error al añadir', 'middle', 'warning');
    } finally {
      loading.dismiss();
    }
  }
}
