export interface Pizza {
  nombre: string;
  descripcion: string;
  descuento: string;
  tamanosPrecios: TamanosPrecios;
  opciones: Opciones;
}

export interface TamanosPrecios {
  familiar: number;
  mediana: number;
  personal: number;
}

export interface Opciones {
  cambioDeMasa: boolean;
  cambioSabor: boolean;
  esEntero: boolean;
  esDuo: boolean;
  esCuatroEstaciones: boolean;
}

export interface PizzaDb extends Pizza {
  id: string;
  image: string;
}
