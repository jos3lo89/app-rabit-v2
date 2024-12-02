import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonCardTitle, IonButton, IonCardContent, IonGrid, IonCardHeader, IonList, IonSkeletonText } from '@ionic/angular/standalone';
import { RollsDb } from 'src/app/shared/interfaces/rolls.interface';
import { RollsService } from 'src/app/shared/services/rolls.service';

@Component({
  selector: 'app-rolls-slider',
  templateUrl: './rolls-slider.component.html',
  styleUrls: ['./rolls-slider.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonList, IonCardHeader, IonGrid, IonCardContent, IonButton, IonCardTitle, IonCard, CommonModule],
})
export class RollsSliderComponent {
  private _rollsService = inject(RollsService);
  private _route = inject(Router);
  rolls: null | RollsDb[] = null;

  isContentVisible = true;

  toggleVisibility() {
    this.isContentVisible = !this.isContentVisible;
  }

  constructor() {
    this._rollsService.listingRolls().subscribe({
      next: (data) => {
        this.rolls = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  pushRouter(url: string) {
    this._route.navigateByUrl(url);
  }
  pushDetails(id: string) {
    console.log(id);
    this._route.navigate(['/details-rolls'], {
      queryParams: {
        id,
        backUrl: 'home',
      },
    });
  }
}
