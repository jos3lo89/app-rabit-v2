import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { CartDb } from '../interfaces/cart.interfaces';

export interface ProductoPdf {
  id: string;
  id_user: string;
  id_producto: string;
  nombre: string;
  imagen_url: string;
  cantidad: number;
  precio_total: number;
  precio_unitario: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private companyData = {
    nombre: 'Rabit',
    ruc: '235343263SDT2342',
    direccion: 'Av las fresias 123',
    email: 'rabit@gmail.com',
    web: 'www.pizzasrabit.com',
  };

  private ticketInfo = {
    titulo: 'Boleta de venta electrónica',
    numero: Math.floor(Math.random() * (999 - 100 + 1) + 100),
    fechaDeEmision: new Date().toLocaleDateString(),
    horaDeEmision: new Date().toLocaleTimeString(),
    cliente: '------',
    dni: '------',
    direccion: '------',
  };

  constructor() {}

  generarBoleta(carrito: { producto: CartDb[]; totalPagar: number }) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [90, 200],
    });

    // Datos de la empresa
    doc.setFontSize(9);
    doc.text(this.companyData.nombre, 33, 10);
    doc.text(`RUC: ${this.companyData.ruc}`, 23, 16);
    doc.text(this.companyData.direccion, 23, 22);
    doc.text(`Email: ${this.companyData.email}`, 22, 28);
    doc.text(`Web: ${this.companyData.web}`, 22, 34);

    // Información del ticket
    doc.setFontSize(12);
    doc.text(this.ticketInfo.titulo, 18, 45);
    doc.setFontSize(9);
    doc.text(`B033-${this.ticketInfo.numero}`, 35, 50);
    doc.text(`Fecha de emisión: ${this.ticketInfo.fechaDeEmision}`, 10, 60);
    doc.text(`Hora de emisión: ${this.ticketInfo.horaDeEmision}`, 10, 66);
    doc.text(`Cliente: ${this.ticketInfo.cliente}`, 10, 72);
    doc.text(`DNI: ${this.ticketInfo.dni}`, 10, 78);
    doc.text(`Dirección: ${this.ticketInfo.direccion}`, 10, 84);

    // Detalle de productos
    doc.text('CANT', 10, 94);
    doc.text('NOMBRE', 25, 94);
    doc.text('P. UNIT', 50, 94);
    doc.text('TOTAL', 70, 94);

    let y = 100;

    carrito.producto.forEach((item: CartDb) => {
      doc.text(`${item.cantidad}`, 10, y);
      doc.text(`${item.nombre.substring(0, 20)}`, 30, y);
      doc.text(`${item.precioUnidad.toFixed(2)}`, 60, y, { align: 'right' });
      doc.text(`${item.precioTotal.toFixed(2)}`, 80, y, { align: 'right' });
      y += 6;
    });

    // Total a pagar
    doc.setFontSize(12);
    doc.text(`Total a pagar: S/ ${carrito.totalPagar.toFixed(2)}`, 10, y + 10);

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
