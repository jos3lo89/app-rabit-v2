import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loadingController = inject(LoadingController);
  constructor() {}

  loading() {
    return this, this._loadingController.create({ spinner: 'crescent' });
  }
}
