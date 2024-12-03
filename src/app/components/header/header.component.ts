import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { CartBtnComponent } from '../cart-btn/cart-btn.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonButtons, IonToolbar, IonHeader, CartBtnComponent, IonMenuButton],
})
export class HeaderComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
