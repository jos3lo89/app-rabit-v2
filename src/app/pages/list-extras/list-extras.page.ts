import { Component, inject, OnInit } from '@angular/core';
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
import { ExtrasService } from 'src/app/shared/services/extras.service';
import { Router } from '@angular/router';
import { ExtrasDb } from 'src/app/shared/interfaces/extras.interfaces';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-list-extras',
  templateUrl: './list-extras.page.html',
  styleUrls: ['./list-extras.page.scss'],
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
export class ListExtrasPage implements OnInit {
  private _extrasService = inject(ExtrasService);
  private _router = inject(Router);
  extras: ExtrasDb[] | null = null;
  filteredextrasF: ExtrasDb[] | null = null;

  constructor() {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.getingDrinks();
  }

  getingDrinks() {
    this._extrasService.listingExtras().subscribe({
      next: (data) => {
        this.extras = data;
        this.filteredextrasF = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  filterextras(event: any) {
    const query = event.detail.value?.toLowerCase() || '';

    if (!query) {
      this.filteredextrasF = this.extras;
      return;
    }
    if (!this.extras) return;
    this.filteredextrasF = this.extras.filter((drink) =>
      drink.nombre.toLowerCase().includes(query)
    );
  }
  pushDetails(id: string) {
    this._router.navigate(['/details-extras'], {
      queryParams: {
        id,
        backUrl: 'list-extras',
      },
    });
  }

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }
}
