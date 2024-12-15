export interface PdfV2 {
  id: string;
  userId: string;
  totalAmount: number;
  products: Product[];
  date: string;
  num_mesa: number;
  num_ticket: number;
}

export interface Product {
  idUser: string;
  id: string;
  nombre: string;
  imagen: string;
  cantidad: number;
  precioTotal: number;
  pizzaDetail?: PizzaDetail;
  idItem: string;
  precioUnidad: number;
  descuento: number;
}

export interface PizzaDetail {
  esDuo: boolean;
  esEntero: boolean;
  sabor: string;
  masa: string;
  tamano: string;
  esCuatroEstaciones: boolean;
}
