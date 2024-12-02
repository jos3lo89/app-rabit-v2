// export interface Pizza {
//   nombre: string;
//   descripcion: string;
//   masa: string;
//   descuento: string;
//   tipoPizza: string; // Define el tipo de pizza: "duo", "sencilla", "cuatro-estaciones", etc.
//   tamanosPrecios: TamanosPrecios;
//   opciones: OpcionesPizza; // Las opciones como dulce, salada o ambas
// }

// export interface TamanosPrecios {
//   familiar: number;
//   mediana: number;
//   personal: number;
// }

// export interface OpcionesPizza {
//   tipo: 'salada' | 'dulce' | 'salada-dulce'; // Nuevo campo para elegir entre salada, dulce o ambas
//   masa: 'artesanal' | 'clasica';
//   configuracion: 'completa' | 'duo' | 'cuatro-estaciones'; // Cómo está configurada la pizza
//   duo?: Duo; // Solo si la pizza tiene la opción "duo"
//   cuatroEstaciones?: CuatroEstaciones; // Solo si la pizza tiene la opción "cuatro-estaciones"
// }

// export interface Duo {
//   mitad1: string | null; // Primera mitad de la pizza (puede ser "americana", "hawaina", etc.)
//   mitad2: string | null; // Segunda mitad de la pizza
// }

// export interface CuatroEstaciones {
//   cuarto1: string | null; // Ingredientes para la primera sección de la pizza
//   cuarto2: string | null; // Ingredientes para la segunda sección
//   cuarto3: string | null; // Ingredientes para la tercera sección
//   cuarto4: string | null; // Ingredientes para la cuarta sección
// }

// export interface PizzaDb extends Pizza {
//   id: string; // ID único de la pizza en la base de datos
//   image: string; // URL de la imagen de la pizza
// }

// -------------------------------------------------------------------------------------
// new interfaces
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
