import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonCardTitle, IonButton, IonCardContent, IonList, IonGrid, IonCardHeader, IonSkeletonText } from '@ionic/angular/standalone';
import { CalzoneDB } from 'src/app/shared/interfaces/calzone.interfaces';
import { CalzoneService } from 'src/app/shared/services/calzone.service';

@Component({
  selector: 'app-calsone-slider',
  templateUrl: './calzone-slider.component.html',
  styleUrls: ['./calzone-slider.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonCardHeader, IonGrid, IonList, IonCardContent, IonButton, IonCardTitle, IonCard,  CommonModule],
})
export class CalzoneSliderComponent {
  private _calzoneService = inject(CalzoneService);
  private _router = inject(Router);
  isContentVisible = true;

  toggleVisibility() {
    this.isContentVisible = !this.isContentVisible;
  }

  calzones: null | CalzoneDB[] = null;
  constructor() {
    this._calzoneService.getingCalzone().subscribe({
      next: (data) => {
        this.calzones = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  pushRouter(url: string) {
    this._router.navigateByUrl(url);
  }

  pushDetails(id: string) {
    this._router.navigate(['/details-calzone'], {
      queryParams: {
        id,
        backUrl: 'home',
      },
    });
  }
}
