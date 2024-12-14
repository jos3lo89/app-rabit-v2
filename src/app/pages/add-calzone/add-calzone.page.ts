import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonButton,
  IonTextarea,
  IonTitle,
  IonCardContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonInput,
  ToastController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UploadImageService } from 'src/app/shared/services/upload-image.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CalzoneService } from 'src/app/shared/services/calzone.service';
import { CameraSource } from '@capacitor/camera';
import { CalzoneDB } from 'src/app/shared/interfaces/calzone.interfaces';
import { addIcons } from 'ionicons';
import { camera, close, image, arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-add-calzone',
  templateUrl: './add-calzone.page.html',
  styleUrls: ['./add-calzone.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonModal,
    IonCardContent,
    IonInput,
    IonTitle,
    IonButton,
    IonCard,
    IonTextarea,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AddCalzonePage {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _uploadImageService = inject(UploadImageService);
  private _calzoneService = inject(CalzoneService);
  // private _toast = inject(ToastService);
  private _toastController = inject(ToastController)

  dynamicPrice: number = 0;
  openModal = false;
  calzoneFoto: string | null = null;
  addLoading = false;
  rolls: CalzoneDB[] | null = null;
  CameraSource = CameraSource;

  form = this._fb.group({
    nombre: this._fb.control('', [Validators.required]),
    descripcion: this._fb.control('', [Validators.required]),
    precio: this._fb.control(10, [Validators.required]),
  });

  constructor() {
    addIcons({arrowBackOutline,close,camera,image});
  }

  async addCalzone() {
    try {
      const { descripcion, nombre, precio } = this.form.value;

      if (!this.calzoneFoto) return;

      if (!descripcion || !nombre || !precio) return;

      this.addLoading = true;

      await this._calzoneService.addCalzone(
        {
          descripcion,
          nombre,
          precio,
        },
        this.calzoneFoto
      );

//  await     this._toast.getToast('registrado con exito', 'middle', 'success');

const toast = await this._toastController.create({
  message :"Registrado con exito",
  position: "top",
  color: "success"
})
await toast.present()

      this.form.reset();
      this.calzoneFoto = null;
      this.addLoading = false;
    } catch (error) {
      console.log(error);
    //  await this._toast.getToast('Error al registrar', 'bottom', 'danger');


    const toast = await this._toastController.create({
      message: "Error al registrarse",
      position: "bottom",
      color: "danger"
    })

    await toast.present() 

      this.addLoading = false;
    }
  }

  async takeImage(source: CameraSource) {
    this.calzoneFoto = await this._uploadImageService.takeImage(source);
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
    this.calzoneFoto = null;
  }
}
