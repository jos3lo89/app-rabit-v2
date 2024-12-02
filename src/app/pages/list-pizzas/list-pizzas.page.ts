import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonButton, IonSearchbar, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonSpinner } from '@ionic/angular/standalone';
import { PizzaService } from 'src/app/shared/services/pizza.service';
import { PizzaDb } from 'src/app/shared/interfaces/pizza.interfaces';
import { NavigationExtras, Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-list-pizzas',
  templateUrl: './list-pizzas.page.html',
  styleUrls: ['./list-pizzas.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCardContent, IonSearchbar, IonButton, IonCard, IonContent,  CommonModule, FormsModule],
})
export class ListPizzasPage {
  private _pizzasService = inject(PizzaService);
  private _router = inject(Router);
  private _cartService = inject(CartService);

  pizzas: PizzaDb[] | null = null;
  filteredPizzas: PizzaDb[] | null = null;

  constructor() {
    this.getingPizzas();
  }

  getingPizzas() {
    this._pizzasService.listingPizzas().subscribe({
      next: (data) => {
        console.log(data);

        this.pizzas = data;
        this.filteredPizzas = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  pushDetails(id: string) {
    console.log(id);
    this._router.navigate(['/details-pizza'], {
      queryParams: {
        id,
        backUrl: 'list-pizzas',
      },
    });
  }

  filterPizzas(event: any) {
    const query = event.detail.value?.toLowerCase() || '';

    if (!query) {
      this.filteredPizzas = this.pizzas;
      return;
    }
    if (!this.pizzas) return;
    this.filteredPizzas = this.pizzas.filter((pizza) =>
      pizza.nombre.toLowerCase().includes(query)
    );
  }

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }


}
