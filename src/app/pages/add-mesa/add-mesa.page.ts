import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonTitle,
  IonCard,
  IonButton,
  IonIcon,
  IonInput,
  IonTextarea,
  ToastController,
} from '@ionic/angular/standalone';
import { MesasService } from 'src/app/shared/services/mesas.service';
import { EstadoMesa } from 'src/app/shared/interfaces/mesa.interfaces';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-add-mesa',
  templateUrl: './add-mesa.page.html',
  styleUrls: ['./add-mesa.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonIcon,
    IonButton,
    IonCard,
    IonContent,
    IonTextarea,
    IonTitle,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AddMesaPage implements OnInit {
  private _mesaService = inject(MesasService);
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _toastController = inject(ToastController);

  guardando = false;

  form = this._fb.group({
    num_mesa: this._fb.control(1, [Validators.required]),
    capacidad: this._fb.control(4, [Validators.required]),
    ubicacion: this._fb.control('Interior', [Validators.required]),
    notas: this._fb.control(''),
  });

  constructor() {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {}

  async registrarMesa() {
    try {
      console.log(this.form.value);

      const { capacidad, notas, num_mesa, ubicacion } = this.form.value;

      if (!capacidad || !num_mesa || !ubicacion) {
        const toast = await this._toastController.create({
          message: 'Ingrese los datos en el formulario',
          duration: 1500,
          position: 'middle',
          color: 'danger',
        });

        await toast.present();

        return;
      }

      // console.log({
      //   capacidad,
      //   estado: EstadoMesa.ACTIVO,
      //   fecha_creacion: dayjs().toISOString(),
      //   num_mesa,
      //   ubicacion,
      //   notas,
      // });
      this.guardando = true;

      await this._mesaService.registrarMesa({
        capacidad,
        estado: EstadoMesa.ACTIVO,
        fecha_creacion: dayjs().toISOString(),
        num_mesa,
        ubicacion,
        notas: notas ? notas : '',
      });

      const toast = await this._toastController.create({
        message: 'Mesa registrada con exito.',
        duration: 1000,
        position: 'middle',
        color: 'success',
      });
      await toast.present();

      this.guardando = false;
    } catch (error) {
      console.log(error);
      const toast = await this._toastController.create({
        message: 'Error al registrar la mesa',
        duration: 1000,
        position: 'middle',
        color: 'danger',
      });
      await toast.present();

      this.guardando = false;
    }
  }
  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }
}
