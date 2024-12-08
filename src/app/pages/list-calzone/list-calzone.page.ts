import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonButton,
  IonSearchbar,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { CalzoneService } from 'src/app/shared/services/calzone.service';
import { Router } from '@angular/router';
import { CalzoneDB } from 'src/app/shared/interfaces/calzone.interfaces';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-list-calzone',
  templateUrl: './list-calzone.page.html',
  styleUrls: ['./list-calzone.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonSpinner,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSearchbar,
    IonButton,
    IonCard,
    IonContent,
    CommonModule,
    FormsModule,
  ],
})
export class ListCalzonePage {
  private _calzoneService = inject(CalzoneService);
  private _router = inject(Router);

  calzones: CalzoneDB[] | null = null;
  filteredCalzone: CalzoneDB[] | null = null;

  constructor() {
    addIcons({ arrowBackOutline });
    this.getingCalzone();
  }

  getingCalzone() {
    this._calzoneService.getingCalzone().subscribe({
      next: (data) => {
        this.calzones = data;
        this.filteredCalzone = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  pushDetails(id: string) {
    this._router.navigate(['/details-calzone'], {
      queryParams: {
        id,
        backUrl: 'list-calzone',
      },
    });
  }

  filterCalzone(event: any) {
    const query = event.detail.value?.toLowerCase() || '';

    if (!query) {
      this.filteredCalzone = this.calzones;
      return;
    }
    if (!this.calzones) return;
    this.filteredCalzone = this.calzones.filter((pizza) =>
      pizza.nombre.toLowerCase().includes(query)
    );
  }

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }
}
