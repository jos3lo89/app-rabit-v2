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
