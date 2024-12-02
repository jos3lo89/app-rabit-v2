export interface Drink {
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface DrinkDb extends Drink {
  id: string;
  image: string;
}
