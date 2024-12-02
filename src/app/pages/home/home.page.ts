import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { PizzaDb } from 'src/app/shared/interfaces/pizza.interfaces';
import { PizzasSliderComponent } from './components/pizzas-slider/pizzas-slider.component';
import { DrinksSliderComponent } from './components/drinks-slider/drinks-slider.component';
import { RollsSliderComponent } from './components/rolls-slider/rolls-slider.component';
import { CalzoneSliderComponent } from './components/calzone-slider/calzone-slider.component';
import { ExtrasSliderComponent } from './components/extras-slider/extras-slider.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent,
    CommonModule,
    PizzasSliderComponent,
    DrinksSliderComponent,
    RollsSliderComponent,
    CalzoneSliderComponent,
    ExtrasSliderComponent,
  ],
})
export class HomePage {
  private _router = inject(Router);
  pizzas: PizzaDb[] | null = null;

  constructor() {}

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }
}
