import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonCardTitle, IonButton, IonCardContent, IonList, IonGrid, IonCardHeader, IonSkeletonText } from '@ionic/angular/standalone';
import { PizzaDb } from 'src/app/shared/interfaces/pizza.interfaces';
import { PizzaService } from 'src/app/shared/services/pizza.service';

@Component({
  selector: 'app-pizzas-slider',
  templateUrl: './pizzas-slider.component.html',
  styleUrls: ['./pizzas-slider.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonCardHeader, IonGrid, IonList, IonCardContent, IonButton, IonCardTitle, IonCard, CommonModule],
})
export class PizzasSliderComponent {
  private _pizzaService = inject(PizzaService);
  private _router = inject(Router);

  pizzas: PizzaDb[] | null = null;

  constructor() {
    this.getingPizzas();
  }
  isContentVisible = true;

  toggleVisibility() {
    this.isContentVisible = !this.isContentVisible;
  }

  getingPizzas() {
    this._pizzaService.listingPizzas().subscribe({
      next: (data) => {
        // const newData = data.map((p, i) => {
        //   return i < 2 && p;
        // });

        this.pizzas = data;
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
    console.log(id);
    this._router.navigate(['/details-pizza'], {
      queryParams: {
        id,
        backUrl: 'home',
      },
    });
  }
}
