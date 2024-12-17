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
  IonItem,
  IonCard,
  IonLabel,
  IonButton,
  IonSelect,
  IonThumbnail,
  IonSelectOption,
  IonIcon,
  IonSpinner,
  ToastController,
  AlertController,
  IonText,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoMesa, MesaDb } from 'src/app/shared/interfaces/mesa.interfaces';
import { DetallesMesaService } from 'src/app/shared/services/detalles-mesa.service';
import {
  DetallesMesaDb,
  EntregaMesa,
} from 'src/app/shared/interfaces/detallesMesa.interfaces';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { MesasService } from 'src/app/shared/services/mesas.service';

@Component({
  selector: 'app-details-mesa',
  templateUrl: './details-mesa.page.html',
  styleUrls: ['./details-mesa.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonIcon,
    IonButton,
    IonLabel,
    IonText,
    IonCard,
    IonItem,
    IonSelect,
    IonContent,
    CommonModule,
    FormsModule,
    IonThumbnail,
    IonSelectOption,
    ReactiveFormsModule,
  ],
})
export class DetailsMesaPage implements OnInit {
  private _activateRoute = inject(ActivatedRoute);
  private _detailMesaService = inject(DetallesMesaService);
  private _fb = inject(FormBuilder);
  private _toastContrller = inject(ToastController);
  private _router = inject(Router);
  private _mesasService = inject(MesasService);
  private _alertController = inject(AlertController);

  isLoading = false;
  estadoMesa = EstadoMesa;

  form = this._fb.group({
    estado: this._fb.control('', [Validators.required]),
  });

  mesa: MesaDb | null = null;
  detallesMesa: DetallesMesaDb | null = null;

  estadosEntrega = Object.values(EntregaMesa);

  async registrarCambioEstado() {
    try {
      console.log(this.form.value);
      if (!this.detallesMesa) {
        const toast = await this._toastContrller.create({
          message: 'No hay detalles',
          duration: 1000,
          color: 'warning',
          position: 'middle',
        });
        await toast.present();

        return;
      }

      const { estado } = this.form.value;
      if (!estado) {
        const toast = await this._toastContrller.create({
          message: 'Seleccione un estado',
          duration: 1000,
          color: 'warning',
          position: 'middle',
        });
        await toast.present();
        return;
      }

      await this._detailMesaService.changeStateMesa({
        estado_detalles: estado,
        id_detalles: this.detallesMesa.id,
      });

      const toast = await this._toastContrller.create({
        message: 'Estado cambiado correctamente',
        duration: 1000,
        color: 'success',
        position: 'middle',
      });

      await toast.present();
      await this.getDetallesWithIdMesa();
    } catch (error) {
      console.log(error);
    }
  }

  async limpiarMesa() {
    const alert = await this._alertController.create({
      header: 'Confirmar acción',
      message: '¿Estas seguro de limpiar la mesa?',
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
              if (this.detallesMesa) {
                await this._detailMesaService.deleteDoc(this.detallesMesa.id);

                const { estado } = this.form.value;

                await this._detailMesaService.changeStateMesapp({
                  estado_mesa: estado == 'pendiente' ? 'en_uso' : 'activo',
                  id_mesa: this.detallesMesa.id_mesa,
                });
                await this.getDetallesWithIdMesa();
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  private params = {
    idMesa: '',
    backUrl: '',
  };

  constructor() {
    addIcons({ arrowBackOutline });
  }

  async ionViewWillEnter() {
    this.getParams();

    await this.getDetallesWithIdMesa();
  }
  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }

  backBtn() {
    this._router.navigateByUrl(this.params.backUrl);
  }

  ngOnInit() {}

  async getDetallesWithIdMesa() {
    try {
      this.isLoading = true;

      this.detallesMesa = await this._detailMesaService.getDetailWithId(
        this.params.idMesa
      );

      this.mesa = await this._mesasService.getMesa(this.params.idMesa);

      this.isLoading = false;

      console.log('los detalles de la mesa', this.detallesMesa);
    } catch (error) {
      console.log(error);

      this.isLoading = false;
    } finally {
      this.isLoading = false;
    }
  }

  getParams() {
    this._activateRoute.queryParams.subscribe({
      next: (data) => {
        this.params.idMesa = data['idMesa'];
        this.params.backUrl = data['backUrl'];
      },
    });
  }
}
