import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonDatetime,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonIcon,
  IonDatetimeButton,
  IonModal,
  IonText,
} from '@ionic/angular/standalone';
import { CartService } from 'src/app/shared/services/cart.service';
import { PdfService } from 'src/app/shared/services/pdf.service';
import { addIcons } from 'ionicons';
import { printOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-history',
  templateUrl: './ticket-history.page.html',
  styleUrls: ['./ticket-history.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonModal,
    IonDatetimeButton,
    IonIcon,
    IonList,
    IonButton,
    IonLabel,
    IonItem,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonTitle,
    CommonModule,
    IonDatetime,
    FormsModule,
  ],
})
export class TicketHistoryPage implements OnInit {
  private _cartService = inject(CartService);
  private _pdfService = inject(PdfService);
  private _router = inject(Router);

  tickets: any[] = [];
  startDate: string = this.getTodayDate();
  endDate: string = this.getTodayDate(); // me servi en un futuro

  pushRouter(route: string) {
    this._router.navigateByUrl(route);
  }

  getTodayDate(): string {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const formattedDate = formatter.format(today);

    return formattedDate;
  }

  constructor() {
    addIcons({ printOutline });
  }

  ngOnInit() {}

  async fetchTickets() {
    if (!this.startDate) {
      console.warn('Por favor, selecciona una fecha.');
      return;
    }

    try {
      const [year, month, day] = this.startDate.split('-');

      this.tickets = await this._cartService.getTicketsByDate(
        `${parseInt(day)}/${parseInt(month)}/${year}`
      );
    } catch (error) {
      console.error('Error al obtener tickets:', error);
    }
  }

  reprintTicket(ticket: any) {
    console.log('Reimprimiendo ticket:', ticket);

    this._pdfService.generarBoleta({
      producto: ticket.products,
      totalPagar: ticket.totalAmount,
    });
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }
}
