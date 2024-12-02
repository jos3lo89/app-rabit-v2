import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonButton, IonSearchbar, IonCardContent, IonCardTitle, IonCardHeader, IonCardSubtitle, IonSpinner } from '@ionic/angular/standalone';
import { CalzoneService } from 'src/app/shared/services/calzone.service';
import { Router } from '@angular/router';
import { CalzoneDB } from 'src/app/shared/interfaces/calzone.interfaces';

@Component({
  selector: 'app-list-calzone',
  templateUrl: './list-calzone.page.html',
  styleUrls: ['./list-calzone.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonCardSubtitle, IonCardHeader, IonCardTitle, IonCardContent, IonSearchbar, IonButton, IonCard, IonContent,  CommonModule, FormsModule],
})
export class ListCalzonePage {
  private _calzoneService = inject(CalzoneService);
  private _router = inject(Router);

  calzones: CalzoneDB[] | null = null;
  filteredCalzone: CalzoneDB[] | null = null;

  constructor() {
    this.getingCalzone();
  }

  getingCalzone() {
    this._calzoneService.getingCalzone().subscribe({
      next: (data) => {
        this.calzones = data;
        this.filteredCalzone = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  pushDetails(id: string) {
    console.log(id);
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
