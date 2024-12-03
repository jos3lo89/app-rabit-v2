import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
@Component({
  selector: 'app-cart-btn',
  templateUrl: './cart-btn.component.html',
  styleUrls: ['./cart-btn.component.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, RouterLink, CommonModule],
})
export class CartBtnComponent implements OnInit {
  private _cartService = inject(CartService);
  private _authService = inject(AuthService);

  // public cartCount: number = 0;

  // public cartCount$ = this._cartService.cartCount$; // Usar Observable para el contador
  // public cartCount$ = this._cartService.cartCount$; // Usar Observable para el contador
  // Suscribirse al observable cartCount$
  // public cartCount$ = this._cartService.cartCount$;

  public cartCount2: Signal<number> = this._cartService.cartCount;

  constructor() {
    addIcons({ cartOutline });

    // this._authService.authState$.subscribe({
    //   next: (data) => {
    //     if (!data) {
    //       console.log('no SE a iniciado sesioon');
    //       return;
    //     }
    //     this._cartService.cartQuantity(data.uid).subscribe({
    //       next: (data) => {
    //         this.cartCount = data;
    //       },
    //       error: (error) => {
    //         console.log(error);
    //       },
    //     });
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   },
    // });
  }

  ngOnInit() {}
}
