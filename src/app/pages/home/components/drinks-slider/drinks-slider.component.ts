import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCard,
  IonCardTitle,
  IonButton,
  IonCardContent,
  IonGrid,
  IonList,
  IonSkeletonText,
  IonCardHeader,
} from '@ionic/angular/standalone';
import { DrinkDb } from 'src/app/shared/interfaces/drink.interfaces';
import { DrinkService } from 'src/app/shared/services/drink.service';

@Component({
  selector: 'app-drinks-slider',
  templateUrl: './drinks-slider.component.html',
  styleUrls: ['./drinks-slider.component.scss'],
  standalone: true,
  imports: [
    IonCardHeader,
    IonSkeletonText,
    IonList,
    IonGrid,
    IonCardContent,
    IonButton,
    IonCardTitle,
    IonCard,
    CommonModule,
  ],
})
export class DrinksSliderComponent {
  private _drinkservice = inject(DrinkService);
  private _router = inject(Router);
  isContentVisible = true;

  toggleVisibility() {
    this.isContentVisible = !this.isContentVisible;
  }

  drinks: DrinkDb[] | null = null;

  constructor() {
    this.getingPizzas();
  }

  getingPizzas() {
    this._drinkservice.listingDrinks().subscribe({
      next: (data) => {
        this.drinks = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  pushRouter(router: string) {
    this._router.navigateByUrl(router);
  }

  pushDetails(id: string) {
    this._router.navigate(['/details-drink'], {
      queryParams: {
        id,
        backUrl: 'home',
      },
    });
  }
}
