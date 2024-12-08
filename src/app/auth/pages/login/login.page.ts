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
  IonList,
  IonCardContent,
  IonButton,
  IonInputPasswordToggle,
  IonInput,
  IonSpinner,
  ToastController,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { GoogleBtnComponent } from '../../components/google-btn/google-btn.component';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { addIcons } from 'ionicons';
import { diamond, lockClosed, mailOutline, mailSharp } from 'ionicons/icons';
import { Dialog } from '@capacitor/dialog';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonSpinner,
    IonButton,
    IonCardContent,
    IonList,
    IonCardTitle,
    IonCardHeader,
    IonInputPasswordToggle,
    IonCard,
    IonContent,
    IonInput,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    IonInput,
  ],
})
export default class LoginPage implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _toastController = inject(ToastController);

  constructor() {
    addIcons({ lockClosed, mailOutline, mailSharp });
  }

  isLoadingBtnSubmit = false;
  isLoadingGoogleBtn = false;

  ngOnInit() {}

  form = this._formBuilder.group({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  async ingresar() {
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: 'Are you like boton',
    });
    console.log('valor de dialog', value);

    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    if (!email || !password) return;

    try {
      this.isLoadingBtnSubmit = true;

      const user = await this._authService.login({
        email,
        password,
      });

      this._router.navigateByUrl('/home');
      this.isLoadingBtnSubmit = false;

      const toast = await this._toastController.create({
        message: `Vienvenido ${
          user.user.displayName ? user.user.displayName : user.user.email
        }`,
        duration: 1500,
        position: 'middle',
        color: 'success',
      });

      await toast.present();

      this.form.reset();
    } catch (error) {
      console.log(error);
      const toast = await this._toastController.create({
        message: 'Error al iniciar sesión',
        duration: 1500,
        position: 'middle',
        color: 'danger',
      });

      await toast.present();
      this.isLoadingBtnSubmit = false;
    }
  }

  async loginWithGoogle() {
    try {
      this.isLoadingGoogleBtn = true;
      await this._authService.loginWithGoogle();
      this._router.navigateByUrl('/home');
      this.isLoadingGoogleBtn = false;
    } catch (error) {
      console.log(error);
      this.isLoadingGoogleBtn = false;
    }
  }
}
