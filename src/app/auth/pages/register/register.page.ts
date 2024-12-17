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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonButton,
  IonInput,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonButton,
    IonList,
    IonCardContent,
    IonCardTitle,
    IonInput,
    IonCardHeader,
    IonCard,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export default class RegisterPage implements OnInit {
  private _authService = inject(AuthService);
  private _fb = inject(FormBuilder);
  private _toastController = inject(ToastController);

  isloadingSubmitBtn = false;

  public form = this._fb.group({
    email: this._fb.control('', [Validators.required, Validators.email]),
    password: this._fb.control('', [Validators.required]),
    nombre: this._fb.control('', [Validators.required]),
    apellido: this._fb.control('', [Validators.required]),
  });

  constructor() {}

  ngOnInit() {}

  async registrar() {
    if (!this.form.valid) {
      const toast = await this._toastController.create({
        message: 'Formulario invalido',
        position: 'top',
        duration: 1500,
        color: 'warning',
      });

      await toast.present();

      return;
    }

    try {
      const { email, password, apellido, nombre } = this.form.value;
      if (!email || !password || !nombre || !apellido) {
        const toast = await this._toastController.create({
          message: 'Rellene el formulario',
          position: 'top',
          duration: 1500,
          color: 'warning',
        });

        await toast.present();

        return;
      }

      this.isloadingSubmitBtn = true;

      await this._authService.registrar({
        email,
        password,
        apellido,
        nombre,
        rol: 'user',
      });

      const toast = await this._toastController.create({
        message: 'Registrado correctamente',
        position: 'top',
        duration: 1500,
        color: 'success',
      });

      await toast.present();

      this.form.reset();

      this.isloadingSubmitBtn = false;
    } catch (error) {
      console.log(error);
      this.isloadingSubmitBtn = false;
    }
  }
}
