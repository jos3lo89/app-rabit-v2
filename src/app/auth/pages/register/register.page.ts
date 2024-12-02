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
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
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
  private _loadinService = inject(LoadingService);
  private _fb = inject(FormBuilder);
  private _toastService = inject(ToastService);

  public form = this._fb.group({
    email: this._fb.control('', [Validators.required, Validators.email]),
    password: this._fb.control('', [Validators.required]),
    nombre: this._fb.control('', [Validators.required]),
    apellido: this._fb.control('', [Validators.required]),
    // rol: this._fb.control('', [Validators.required]),
  });

  constructor() {}

  ngOnInit() {}

  async registrar() {
    if (!this.form.valid) {
      this._toastService.getToast('Formulario invalido', 'top', 'warning');

      return;
    }

    const loading = await this._loadinService.loading();
    await loading.present();

    try {
      const { email, password, apellido, nombre } = this.form.value;
      if (!email || !password || !nombre || !apellido) {
        this._toastService.getToast('Rellene el formulario', 'top', 'warning');

        return;
      }

      await this._authService.registrar({
        email,
        password,
        apellido,
        nombre,
        rol: 'user',
      });

      this._toastService.getToast('Registrado correctamente', 'top', 'success');
      this.form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      loading.dismiss();
    }
  }
}
