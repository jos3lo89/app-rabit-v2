export interface RollsForm {
  nombre: string;
  descripcion: string;
  precio: number;
}


export interface RollsDb extends RollsForm {
  id: string
  image: string
}
