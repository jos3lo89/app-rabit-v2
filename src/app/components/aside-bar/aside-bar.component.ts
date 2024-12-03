import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonIcon,
  IonLabel,
  IonList,
  IonMenuToggle,
  IonNote,
  IonMenu,
} from '@ionic/angular/standalone';
import { ToggleThemeComponent } from '../toggle-theme/toggle-theme.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  personOutline,
  personSharp,
  homeOutline,
  homeSharp,
  logInOutline,
  logInSharp,
  logOutOutline,
  logOutSharp,
  pizza,
  pizzaOutline,
  pizzaSharp,
  beerSharp,
  beerOutline,
  apertureSharp,
  apertureOutline,
} from 'ionicons/icons';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { ToastService } from 'src/app/shared/services/toast.service';
@Component({
  selector: 'app-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss'],
  standalone: true,
  imports: [
    IonNote,
    IonList,
    IonLabel,
    IonIcon,
    IonContent,
    ToggleThemeComponent,
    RouterLink,
    RouterLinkActive,
    IonMenuToggle,
    IonMenu,
  ],
})
export class AsideBarComponent implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _toast = inject(ToastService);
  user: User | null = null;

  appPages = [
    // { title: 'Inicio', url: '/home', icon: 'home', isAuth: false },
    // { title: 'Pizzas', url: '/list-pizzas', icon: 'pizza', isAuth: false },
    // { title: 'Bebidas', url: '/list-drinks', icon: 'beer', isAuth: false },
    // { title: 'Rolls', url: '/list-rolls', icon: 'aperture', isAuth: false },
    // { title: 'Calzone', url: '/list-calzone', icon: 'aperture', isAuth: false },
    // { title: 'Extras', url: '/list-extras', icon: 'aperture', isAuth: false },
  ];

  constructor() {
    addIcons({
      homeOutline,
      homeSharp,
      personOutline,
      personSharp,
      logInOutline,
      logInSharp,
      logOutOutline,
      logOutSharp,
      pizzaOutline,
      pizzaSharp,
      beerSharp,
      beerOutline,
      apertureSharp,
      apertureOutline,
    });
  }

  ngOnInit() {
    this._authService.authState$.subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }
}
