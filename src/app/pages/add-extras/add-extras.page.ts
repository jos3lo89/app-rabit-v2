import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonCard,
  IonInput,
  IonContent,
  IonButton,
  IonTitle,
  IonCardContent,
  IonText,
  IonTextarea,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';
import { CameraSource } from '@capacitor/camera';
import { UploadImageService } from 'src/app/shared/services/upload-image.service';
import { addIcons } from 'ionicons';
import { camera, close, image } from 'ionicons/icons';
import { ExtrasService } from 'src/app/shared/services/extras.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-add-extras',
  templateUrl: './add-extras.page.html',
  styleUrls: ['./add-extras.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonInput,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonTextarea,
    IonModal,
    IonCardContent,
    IonTitle,
    IonButton,
    IonContent,
    IonCard,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AddExtrasPage implements OnInit {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _uploadImageService = inject(UploadImageService);
  private _extraService = inject(ExtrasService);
  private _toast = inject(ToastService);

  fotoExtra: string | null = null;
  openModal = false;
  CameraSource = CameraSource;
  addLoading = false;

  form = this._fb.group({
    nombre: this._fb.control('', [Validators.required]),
    descripcion: this._fb.control('', [Validators.required]),
    precio: this._fb.control(10, [Validators.required]),
  });

  constructor() {
    addIcons({ camera, image, close });
  }

  async takeImage(source: CameraSource) {
    this.fotoExtra = await this._uploadImageService.takeImage(source);
    this.closeModal();
  }

  ngOnInit() {}

  async addExtras() {
    try {
      this.addLoading = true;
      const { descripcion, nombre, precio } = this.form.value;

      if (!this.fotoExtra) {
        this._toast.getToast('Insertar un foto', 'middle', 'warning');
        return;
      }

      if (!descripcion || !nombre || !precio) return;

      await this._extraService.addExtras(
        {
          descripcion,
          nombre,
          precio,
        },
        this.fotoExtra
      );

      this.form.reset();
      this.addLoading = false;

      this.fotoExtra = null;

      this._toast.getToast('Extras agergado correctament', 'middle', 'success');
    } catch (error) {
      this._toast.getToast(
        'Error al registrar el producto',
        'middle',
        'danger'
      );
      this.addLoading = false;
      console.log(error);
    }
  }

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }

  quitarFoto() {
    this.fotoExtra = null;
  }

  closeModal() {
    this.openModal = false;
  }
  openModal2() {
    this.openModal = true;
  }
}
