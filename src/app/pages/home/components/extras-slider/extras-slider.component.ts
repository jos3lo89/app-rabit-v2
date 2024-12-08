import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCardTitle,
  IonCard,
  IonButton,
  IonCardContent,
  IonList,
  IonGrid,
  IonCardHeader,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { ExtrasDb } from 'src/app/shared/interfaces/extras.interfaces';
import { ExtrasService } from 'src/app/shared/services/extras.service';

@Component({
  selector: 'app-extras-slider',
  templateUrl: './extras-slider.component.html',
  styleUrls: ['./extras-slider.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonCardHeader,
    IonGrid,
    IonList,
    IonCardContent,
    IonButton,
    IonCard,
    IonCardTitle,
    CommonModule,
  ],
})
export class ExtrasSliderComponent {
  private _extrasService = inject(ExtrasService);
  private _router = inject(Router);
  isContentVisible = true;

  toggleVisibility() {
    this.isContentVisible = !this.isContentVisible;
  }

  extras: ExtrasDb[] | null = null;

  constructor() {
    this.getingPizzas();
  }

  getingPizzas() {
    this._extrasService.listingExtras().subscribe({
      next: (data) => {
        this.extras = data;
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
    this._router.navigate(['/details-extras'], {
      queryParams: {
        id,
        backUrl: 'home',
      },
    });
  }
}
