import { Component, inject, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonContent,
  IonSelectOption,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonModal,
  IonSelect,
  IonInput,
  IonHeader,
  IonCard,
  IonItem,
  IonLabel,
  IonCardContent,
  IonTextarea,
  ToastController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CameraSource } from '@capacitor/camera';
import { UploadImageService } from 'src/app/shared/services/upload-image.service';
import { addIcons } from 'ionicons';
import { camera, close, image, arrowBackOutline } from 'ionicons/icons';
import { RollsService } from 'src/app/shared/services/rolls.service';
import { RollsDb } from 'src/app/shared/interfaces/rolls.interface';

@Component({
  selector: 'app-add-rolls',
  templateUrl: './add-rolls.page.html',
  styleUrls: ['./add-rolls.page.scss'],
  standalone: true,
  imports: [
    IonCardContent,
    IonLabel,
    IonItem,
    IonSelectOption,
    IonCard,
    IonHeader,
    IonInput,
    IonModal,
    IonTextarea,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonContent,
    IonIcon,
    IonSelect,
    IonButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AddRollsPage {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _uploadImageService = inject(UploadImageService);
  private _rollsService = inject(RollsService);
  // private _toast = inject(ToastService);
  private _toastControler = inject(ToastController);

  dynamicPrice: number = 0;
  openModal = false;
  fotoRoll: string | null = null;
  addLoading = false;
  rolls: RollsDb[] | null = null;
  CameraSource = CameraSource;

  form = this._fb.group({
    nombre: this._fb.control('', [Validators.required]),
    descripcion: this._fb.control('', [Validators.required]),
    precio: this._fb.control('', [Validators.required]),
  });

  constructor() {
    addIcons({ arrowBackOutline, close, camera, image });
  }

  async addRoll() {
    try {
      const { descripcion, nombre, precio } = this.form.value;

      if (!this.fotoRoll) {
        //  await       this._toast.getToast('Insertar un foto', 'middle', 'warning');

        const toast = await this._toastControler.create({
          message: 'Insertar un foto',
          duration: 1000,
          position: 'bottom',
          color: 'warning',
        });

        await toast.present();

        return;
      }

      if (!descripcion || !nombre || !precio) return;

      this.addLoading = true;

      await this._rollsService.addRolls(
        {
          descripcion,
          nombre,
          precio: parseInt(precio),
        },
        this.fotoRoll
      );

      // await this._toast.getToast('registrado con exito', 'middle', 'success');
      const toast = await this._toastControler.create({
        message: 'registrado con exito',
        duration: 1000,
        position: 'top',
        color: 'success',
      });

      await toast.present();

      this.form.reset();
      this.fotoRoll = null;
      this.addLoading = false;
    } catch (error) {
      console.log(error);
      // await this._toast.getToast('Error al registrar', 'bottom', 'danger');

      const toast = await this._toastControler.create({
        message: 'Error al registrar',
        duration: 1000,
        color: 'danger',
        position: 'bottom',
      });

      await toast.present();

      this.addLoading = false;
    }
  }

  async takeImage(source: CameraSource) {
    this.fotoRoll = await this._uploadImageService.takeImage(source);
    this.closeModal();
  }

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }

  updateDynamicPrice(event: any) {
    const selectedPrice = Number(event.detail.value);
    if (!isNaN(selectedPrice)) {
      this.dynamicPrice = selectedPrice;
    }
  }

  closeModal() {
    this.openModal = false;
  }
  openModal2() {
    this.openModal = true;
  }

  quitarFoto() {
    this.fotoRoll = null;
  }
}
