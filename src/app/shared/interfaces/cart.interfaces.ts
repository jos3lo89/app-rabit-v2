export interface Cart {
  idUser: string;
  idItem: string;
  nombre: string;
  cantidad: number;
  precioUnidad: number;
  precioTotal: number;
  imagen: string;
  descuento: number;
  pizzaDetail?: PizzaDetails;
}

export interface PizzaDetails {
  tamano: string;
  masa: string;
  sabor: string;
  esEntero: boolean;
  esDuo: boolean;
  esCuatroEstaciones: boolean;

}

export interface CartDb extends Cart {
  id: string;
}

/* ================== */

export interface ProductoCart {
  id: string;
  nombre: string;
  precioUnidad: number;
  precioTotal: number;
  imagen: string;
  idItem: string;
  cantidad: number;
  idUser: string;
  descuento: number;
  pizzaDetail?: PizzaDetail;
}

export interface PizzaDetail {
  esCuatroEstaciones: boolean;
  esEntero: boolean;
  masa: string;
  sabor: string;
  tamano: string;
  esDuo: boolean;
}
