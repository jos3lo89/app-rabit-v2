import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonButton,
  IonSpinner,
  IonIcon,
  AlertController,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { RolesService } from 'src/app/shared/services/roles.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonIcon, IonSpinner, IonButton, IonCard, IonContent, CommonModule],
})
export class ProfilePage implements OnInit {
  private _authService = inject(AuthService);
  private _toast = inject(ToastService);
  private _router = inject(Router);
  private _alertController = inject(AlertController);
  private _rolesService = inject(RolesService);

  user: User | null = null;
  currentRole: string | null = null;

  constructor() {
    addIcons({ arrowBackOutline });
  }

  ionViewWillEnter() {
    this.currentRole = this._rolesService.role();
  }

  ngOnInit() {
    this._authService.authState$.subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async logOut() {
    const alert = await this._alertController.create({
      header: 'Confirmar acción',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Acción cancelada por el usuario');
          },
        },
        {
          text: 'Aceptar',
          handler: async () => {
            try {
              await this._authService.cerrarSesion();
              this._router.navigateByUrl('/home');
 await             this._toast.getToast('Cerraste sesión', 'middle', 'warning');
            } catch (error) {
      await        this._toast.getToast(
                'Error al cerrar sesión',
                'middle',
                'danger'
              );
              console.log(error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }
}
