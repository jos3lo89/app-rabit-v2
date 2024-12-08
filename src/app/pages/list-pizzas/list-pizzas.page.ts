import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonButton,
  IonSearchbar,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { PizzaService } from 'src/app/shared/services/pizza.service';
import { PizzaDb } from 'src/app/shared/interfaces/pizza.interfaces';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-list-pizzas',
  templateUrl: './list-pizzas.page.html',
  styleUrls: ['./list-pizzas.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonSpinner,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonSearchbar,
    IonButton,
    IonCard,
    IonContent,
    CommonModule,
    FormsModule,
  ],
})
export class ListPizzasPage {
  private _pizzasService = inject(PizzaService);
  private _router = inject(Router);

  pizzas: PizzaDb[] | null = null;
  filteredPizzas: PizzaDb[] | null = null;

  constructor() {
    addIcons({ arrowBackOutline });

    this.getingPizzas();
  }

  getingPizzas() {
    this._pizzasService.listingPizzas().subscribe({
      next: (data) => {
        this.pizzas = data;
        this.filteredPizzas = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  pushDetails(id: string) {
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
