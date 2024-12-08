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
  IonCardSubtitle,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RollsDb } from 'src/app/shared/interfaces/rolls.interface';
import { RollsService } from 'src/app/shared/services/rolls.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-list-rolls',
  templateUrl: './list-rolls.page.html',
  styleUrls: ['./list-rolls.page.scss'],
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
export class ListRollsPage {
  private _rollsService = inject(RollsService);
  private _router = inject(Router);

  rolls: RollsDb[] | null = null;
  filteredRolls: RollsDb[] | null = null;

  constructor() {
    addIcons({ arrowBackOutline });
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
    this._router.navigateByUrl(route);
  }
}
