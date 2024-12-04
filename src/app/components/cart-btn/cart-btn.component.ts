import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';
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

  public cartCount2: Signal<number> = this._cartService.cartCount;

  constructor() {
    addIcons({ cartOutline });
  }

  ngOnInit() {}
}
