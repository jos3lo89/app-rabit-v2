import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonButton, IonSearchbar, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonSpinner } from "@ionic/angular/standalone"
import { PizzaService } from 'src/app/shared/services/pizza.service';
import { Router } from '@angular/router';
import { RollsDb } from 'src/app/shared/interfaces/rolls.interface';
import { RollsService } from 'src/app/shared/services/rolls.service';

@Component({
  selector: 'app-list-rolls',
  templateUrl: './list-rolls.page.html',
  styleUrls: ['./list-rolls.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCardContent, IonSearchbar, IonButton, IonCard, IonContent,  CommonModule, FormsModule]
})
export class ListRollsPage {

  private _rollsService = inject(RollsService);
  private _router = inject(Router);

  rolls: RollsDb[] | null = null;
  filteredRolls: RollsDb[] | null = null;

  constructor() {

    this.getingRolls();
  }


  getingRolls() {
    this._rollsService.listingRolls().subscribe({
      next: (data) => {
        this.rolls = data;
        this.filteredRolls = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  pushDetails(id: string) {
    console.log(id);
    this._router.navigate(['/details-rolls'], {
      queryParams: {
        id,
        backUrl: 'list-rolls',
      },
    });
  }

  filterrolls(event: any) {
    const query = event.detail.value?.toLowerCase() || '';

    if (!query) {
      this.filteredRolls = this.rolls;
      return;
    }
    if (!this.rolls) return;
    this.filteredRolls = this.rolls.filter((roll) =>
      roll.nombre.toLowerCase().includes(query)
    );
  }
  pushRouter(route: string) {
    this._router.navigateByUrl(route)
  }





}
