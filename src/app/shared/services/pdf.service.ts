import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';
import { Share } from '@capacitor/share';

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

  async generarBoleta(carrito: { producto: any[]; totalPagar: number }) {
    try {
      // Crear el documento PDF
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
      carrito.producto.forEach((item) => {
        doc.text(`${item.cantidad}`, 10, y);
        doc.text(`${item.nombre.substring(0, 20)}`, 30, y);
        doc.text(`${item.precioUnidad.toFixed(2)}`, 60, y, { align: 'right' });
        doc.text(`${item.precioTotal.toFixed(2)}`, 80, y, { align: 'right' });
        y += 6;
      });

      // Total a pagar
      doc.setFontSize(12);
      doc.text(`Total a pagar: S/ ${carrito.totalPagar.toFixed(2)}`, 10, y + 10);

      // Obtener el PDF como binario
      const pdfBlob = doc.output('blob');

      // Convertir el binario a base64
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split(',')[1];

        if (base64Data) {
          const fileName = `boleta_${this.ticketInfo.numero}.pdf`;

          // Guardar el archivo como binario en el sistema de archivos
          await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Documents,
          });

          // Mostrar mensaje de éxito
          await Toast.show({
            text: `Archivo guardado correctamente en Documentos como ${fileName}.`,
            duration: 'long',
          });

          // Compartir el archivo con otras aplicaciones
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
    } catch (error) {
      console.error('Error al generar la boleta:', error);

      // Mostrar un mensaje de error
      await Toast.show({
        text: 'Error al guardar la boleta.',
        duration: 'long',
      });
    }
  }
}
