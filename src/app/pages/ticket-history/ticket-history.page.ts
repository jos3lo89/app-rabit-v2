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
  IonButton,
  IonList,
  IonIcon,
  IonModal,
  IonText,
  IonSpinner,
} from '@ionic/angular/standalone';
import { CartService } from 'src/app/shared/services/cart.service';
import { PdfService } from 'src/app/shared/services/pdf.service';
import { addIcons } from 'ionicons';
import { printOutline, arrowBackOutline, searchOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { PdfV2 } from 'src/app/shared/interfaces/pdf.interfaces';

@Component({
  selector: 'app-ticket-history',
  templateUrl: './ticket-history.page.html',
  styleUrls: ['./ticket-history.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonText,
    IonModal,
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
    CommonModule,
    IonDatetime,
    FormsModule,
  ],
})
export class TicketHistoryPage implements OnInit {
  private _cartService = inject(CartService);
  private _pdfService = inject(PdfService);
  private _router = inject(Router);

  loading = false;
  ganaciaTotal: null | number = null;
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
    addIcons({ arrowBackOutline, printOutline, searchOutline });
  }

  ngOnInit() {}

  async fetchTickets() {
    if (!this.startDate) return;

    try {
      this.loading = true;
      const [year, month, day] = this.startDate.split('-');

      this.tickets = await this._cartService.getTicketsByDate(
        `${parseInt(day)}/${parseInt(month)}/${year}`
      );

      this.ganaciaTotal = this.tickets.reduce(
        (total, order) => total + order.totalAmount,
        0
      );

      // console.log('total ganacia', totalGanacia);

      console.log('tikcets', this.tickets);

      this.loading = false;
    } catch (error) {
      console.error('Error al obtener tickets:', error);

      this.loading = false;
    }
  }

  reprintTicket(ticket: PdfV2) {
    // this._pdfService.generarBoletaHistory(ticket.products, ticket.totalAmount);
    this._pdfService.generarBoletaHistory(ticket);
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }
}
