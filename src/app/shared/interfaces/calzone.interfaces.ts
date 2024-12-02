export interface Calzone {
  nombre: string
  descripcion: string
  precio: number
}


export interface CalzoneDB extends Calzone {
  id: string
  image: string
}
