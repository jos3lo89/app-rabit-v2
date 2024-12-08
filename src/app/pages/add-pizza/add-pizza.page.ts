import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonCard,
  IonButton,
  IonTitle,
  IonItem,
  IonLabel,
  IonModal,
  IonTextarea,
  IonToolbar,
  IonHeader,
  IonButtons,
  IonIcon,
  IonSelect,
  IonToggle,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { camera, close, image } from 'ionicons/icons';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UploadImageService } from 'src/app/shared/services/upload-image.service';
import { PizzaService } from 'src/app/shared/services/pizza.service';

@Component({
  selector: 'app-add-pizza',
  templateUrl: './add-pizza.page.html',
  styleUrls: ['./add-pizza.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonTextarea,
    IonButtons,
    IonSelect,
    IonHeader,
    IonToolbar,
    IonModal,
    IonLabel,
    IonToggle,
    IonInput,
    IonItem,
    IonTitle,
    IonButton,
    IonCard,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonSelectOption,
  ],
})
export class AddPizzaPage implements OnInit {
  ngOnInit(): void {}

  private _router = inject(Router);
  private _toast = inject(ToastService);
  private _uploadImageService = inject(UploadImageService);
  private _pizzaService = inject(PizzaService);
  private _fb = inject(FormBuilder);

  fotoPizza: string | null = null;
  openModal = false;
  CameraSource = CameraSource;
  guardando = false;
  form = this._fb.group({
    nombre: this._fb.control('', [Validators.required]),
    descripcion: this._fb.control('', [Validators.required]),
    descuento: this._fb.control('0.0', [Validators.required]),
    tamanosPrecios: this._fb.group({
      familiar: this._fb.control(null, Validators.required),
      mediana: this._fb.control(null, Validators.required),
      personal: this._fb.control(null, Validators.required),
    }),
    opciones: this._fb.group({
      cambioDeMasa: this._fb.control(true),
      cambioSabor: this._fb.control(true),
      esEntero: this._fb.control(true),
      esDuo: this._fb.control(false),
      esCuatroEstaciones: this._fb.control(false),
    }),
  });

  constructor() {
    addIcons({ camera, image, close });
  }

  actualizarOpciones(opcion: string) {
    const opciones = this.form.get('opciones') as FormGroup;

    const controlesExclusivos = ['esEntero', 'esDuo', 'esCuatroEstaciones'];

    controlesExclusivos.forEach((key) => {
      opciones.get(key)?.setValue(key === opcion);
    });
  }

  async guardarPizza() {
    try {
      if (!this.form.valid) {
        this._toast.getToast('Corrija el formulario', 'top', 'warning');
        return;
      }

      if (!this.fotoPizza) {
        this._toast.getToast('Agregue una foto', 'top', 'warning');
        return;
      }

      this.guardando = true;

      await this._pizzaService.uploadPizza(this.form.value, this.fotoPizza);

      this.form.reset();
      this.fotoPizza = null;
      this._toast.getToast('Pizza registrado', 'middle', 'success');
      this.guardando = false;
    } catch (error) {
      console.log(error);
      this._toast.getToast('No se pudo registrar la pizza', 'middle', 'danger');
      this.guardando = false;
    }
  }

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }

  async takeImage(source: CameraSource) {
    this.fotoPizza = await this._uploadImageService.takeImage(source);
    this.closeModal();
  }

  closeModal() {
    this.openModal = false;
  }
  openModal2() {
    this.openModal = true;
  }

  quitarFoto() {
    this.fotoPizza = null;
  }
}
