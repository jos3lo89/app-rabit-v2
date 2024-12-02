import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonButton,
  IonCardContent,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonCardContent,
    IonButton,
    IonCard,
    IonContent,
    CommonModule,
  ],
})
export class ProfilePage implements OnInit {
  private _authService = inject(AuthService);
  private _toast = inject(ToastService);
  private _router = inject(Router);

  user: User | null = null;
  constructor() {}

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
    try {
      await this._authService.cerrarSesion();
      this._router.navigateByUrl('/home');
      this._toast.getToast('Cerraste sesión', 'middle', 'warning');
    } catch (error) {
      this._toast.getToast('Error al cerrar sesión', 'middle', 'danger');
      console.log(error);
    }
  }

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }
}
