export interface Extras {
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface ExtrasDb extends Extras {
  id: string;
  image: string;
}
