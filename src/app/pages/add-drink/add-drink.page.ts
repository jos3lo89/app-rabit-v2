import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonTitle,
  IonCard,
  IonModal,
  IonButtons,
  IonToolbar,
  IonInput,
  IonTextarea,
  IonHeader,
  IonIcon,
} from '@ionic/angular/standalone';
import { formBuilder } from './utils/formDrink';
import { Router } from '@angular/router';
import { CameraSource } from '@capacitor/camera';
import { UploadImageService } from 'src/app/shared/services/upload-image.service';
import { addIcons } from 'ionicons';
import { camera, close, image } from 'ionicons/icons';
import { DrinkService } from 'src/app/shared/services/drink.service';
import { ToastService } from 'src/app/shared/services/toast.service';
@Component({
  selector: 'app-add-drink',
  templateUrl: './add-drink.page.html',
  styleUrls: ['./add-drink.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonInput,
    IonTextarea,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonModal,
    IonCard,
    IonTitle,
    IonButton,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AddDrinkPage implements OnInit {
  private _router = inject(Router);
  private _uploadImage = inject(UploadImageService);
  private _drinkService = inject(DrinkService);
  private _toast = inject(ToastService);

  form = formBuilder();
  openModal = false;
  fotoBebida: string | null = null;
  CameraSource = CameraSource;
  guardando = false;

  constructor() {
    addIcons({ camera, image, close });
  }

  ngOnInit() {}

  async takePicture(source: CameraSource) {
    this.fotoBebida = await this._uploadImage.takeImage(source);
    this.closeModal();
  }

  async addDrink() {
    if (!this.fotoBebida) {
      this._toast.getToast('Debe ingresar una imagen', 'middle', 'warning');
      return;
    }

    const { descripcion, nombre, precio } = this.form.value;

    if (!descripcion || !nombre || !precio) {
      this._toast.getToast('complete el formulario', 'middle', 'warning');
      return;
    }
    try {
      this.guardando = true;

      await this._drinkService.addDrink(
        { descripcion, nombre, precio },
        this.fotoBebida
      );

      this.guardando = false;
      this._toast.getToast('Bebida guardada', 'middle', 'success');
      this.form.reset();
      this.fotoBebida = null;
    } catch (error) {
      console.log(error);

      this._toast.getToast('Error al guardar la bebida', 'middle', 'danger');
      this.guardando = false;
    }
  }

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }

  closeModal() {
    this.openModal = false;
  }

  openModal2() {
    this.openModal = true;
  }
}
