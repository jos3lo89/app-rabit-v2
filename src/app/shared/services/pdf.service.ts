import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';
import { Share } from '@capacitor/share';
import { Device } from '@capacitor/device';
import { ProductoCart } from '../interfaces/cart.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private companyData = {
    nombre: 'Pizzeria Rabit',
    ruc: '235343263SDT2342',
    direccion: 'Av las fresias 123',
    email: 'rabit@gmail.com',
    web: 'www.pizzasrabit.com',
  };

  private ticketInfo = {
    // titulo: 'Boleta de venta electrónica',
    titulo: 'Ticket',
    numero: Math.floor(Math.random() * (999 - 100 + 1) + 100),
    fechaDeEmision: new Date().toLocaleDateString(),
    horaDeEmision: new Date().toLocaleTimeString(),
    cliente: '------',
    dni: '------',
    direccion: '------',
  };

  constructor() {}

  async generarBoleta(carrito: {
    producto: ProductoCart[];
    totalPagar: number;
  }) {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [90, 200],
      });

      const logoBase64 = await this.cargarImagenBase64(
        'assets/logo/rabilogo.png'
      );

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.addImage(logoBase64, 'PNG', 35, 10, 20, 20); // Coordenadas (x, y) y tamaño (ancho, alto)
      doc.text(this.companyData.nombre, 45, 10, { align: 'center' });

      // doc.setFontSize(8);
      // doc.setFont('helvetica', 'normal');
      // doc.text(`RUC: ${this.companyData.ruc}`, 45, 15, { align: 'center' });
      // doc.text(this.companyData.direccion, 45, 20, { align: 'center' });
      // doc.text(`Email: ${this.companyData.email}`, 45, 25, { align: 'center' });
      // doc.text(`Web: ${this.companyData.web}`, 45, 30, { align: 'center' });

      // Línea separadora
      doc.line(5, 35, 85, 35);

      // Información del ticket
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(this.ticketInfo.titulo, 45, 40, { align: 'center' });

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      // doc.text(`Boleta: B033-${this.ticketInfo.numero}`, 10, 50);
      doc.text(`Ticket: RABI-${this.ticketInfo.numero}`, 10, 50);
      doc.text(`Fecha: ${this.ticketInfo.fechaDeEmision}`, 10, 55);
      doc.text(`Hora: ${this.ticketInfo.horaDeEmision}`, 10, 60);
      // doc.text(`Cliente: ${this.ticketInfo.cliente}`, 10, 65);
      // doc.text(`DNI: ${this.ticketInfo.dni}`, 10, 70);
      // doc.text(`Dirección: ${this.ticketInfo.direccion}`, 10, 75);

      // Línea separadora
      // doc.line(5, 80, 85, 80);
      doc.line(5, 66, 85, 66);

      // Tabla de productos
      doc.setFontSize(8);
      doc.text('CANT', 10, 70); // 10 - 85
      doc.text('NOMBRE', 25, 70);
      doc.text('P. UNIT', 50, 70);
      doc.text('TOTAL', 70, 70);

      // let y = 90;
      let y = 76;
      carrito.producto.forEach((item) => {
        doc.text(`${item.cantidad}`, 10, y);
        doc.text(`${item.nombre.substring(0, 15)}`, 25, y);
        doc.text(`${item.precioUnidad.toFixed(2)}`, 55, y, { align: 'right' });
        doc.text(`${item.precioTotal.toFixed(2)}`, 75, y, { align: 'right' });
        y += 6;
      });

      // Línea separadora
      doc.line(5, y, 85, y);
      y += 5;

      // Total a pagar
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total a pagar: S/ ${carrito.totalPagar.toFixed(2)}`, 10, y);

      // Mensaje de agradecimiento
      y += 10;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('¡Gracias por su compra!', 45, y, { align: 'center' });

      const pdfBlob = doc.output('blob');

      const info = await Device.getInfo();

      if (info.platform === 'web') {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      } else if (info.platform === 'android' || info.platform === 'ios') {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);

        reader.onloadend = async () => {
          const base64Data = reader.result?.toString().split(',')[1];

          if (base64Data) {
            const fileName = `boleta_${this.ticketInfo.numero}.pdf`;

            await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Documents,
            });

            await Toast.show({
              text: `Archivo guardado correctamente en Documentos como ${fileName}.`,
              duration: 'long',
            });

            const fileUri = await Filesystem.getUri({
              path: fileName,
              directory: Directory.Documents,
            });

            await Share.share({
              title: 'Compartir Boleta',
              text: 'Aquí está tu boleta de venta electrónica.',
              url: fileUri.uri,
              dialogTitle: 'Compartir con:',
            });
          }
        };
      }
    } catch (error) {
      console.error('Error al generar la boleta:', error);

      await Toast.show({
        text: 'Error al guardar la boleta.',
        duration: 'long',
      });
    }
  }

  async cargarImagenBase64(ruta: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = ruta;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
    });
  }
}
