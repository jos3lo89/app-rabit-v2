import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrinkService } from 'src/app/shared/services/drink.service';
import { DrinkDb } from 'src/app/shared/interfaces/drink.interfaces';
import { IonContent, IonCard, IonButton, IonSearchbar, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-drinks',
  templateUrl: './list-drinks.page.html',
  styleUrls: ['./list-drinks.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCardContent, IonSearchbar, IonButton, IonCard, IonContent,  CommonModule, FormsModule],
})
export class ListDrinksPage implements OnInit {
  private _drinkService = inject(DrinkService);
  private _router = inject(Router);
  drinks: DrinkDb[] | null = null;
  filteredDrinksF: DrinkDb[] | null = null;

  constructor() {}

  ngOnInit() {
    this.getingDrinks();
  }

  getingDrinks() {
    this._drinkService.listingDrinks().subscribe({
      next: (data) => {
        this.drinks = data;
        this.filteredDrinksF = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  filterDrinks(event: any) {
    const query = event.detail.value?.toLowerCase() || '';

    if (!query) {
      this.filteredDrinksF = this.drinks;
      return;
    }
    if (!this.drinks) return;
    this.filteredDrinksF = this.drinks.filter((drink) =>
      drink.nombre.toLowerCase().includes(query)
    );
  }
  pushDetails(id: string) {
    console.log(id);
    this._router.navigate(['/details-drink'], {
      queryParams: {
        id,
        backUrl: 'list-drinks',
      },
    });
  }

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }
}
