import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { MesaDb } from 'src/app/shared/interfaces/mesa.interfaces';
import { MesasService } from 'src/app/shared/services/mesas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.page.html',
  styleUrls: ['./mesas.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCard, IonContent, CommonModule, FormsModule],
})
export class MesasPage implements OnInit {
  private _mesasService = inject(MesasService);
  private _router = inject(Router);

  mesas: null | MesaDb[] = null;
  constructor() {}

  ionViewWillEnter() {
    this.gettingMesas();
  }

  ngOnInit() {}

  gettingMesas() {
    this._mesasService.gettingMesas().subscribe({
      next: (data) => {
        console.log(data);
        this.mesas = data
          .sort((a, b) => a.num_mesa - b.num_mesa)
          .filter((mesa) => mesa.num_mesa !== 0);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  pushDetails(id: string) {
    this._router.navigate(['/details-mesa'], {
      queryParams: {
        idMesa: id,
        backUrl: 'mesas',
      },
    });
  }
}
