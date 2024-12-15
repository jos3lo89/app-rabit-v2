export enum EstadoMesa {
  ACTIVO = 'activo',
  DESUSO = 'desuso',
  EN_USO = 'en_uso',
}

export interface MesaRegister {
  num_mesa: number;
  estado: EstadoMesa;
  capacidad: number;
  fecha_creacion: string;
  ubicacion: string;
  notas?: string;
}

export interface MesaDb extends MesaRegister {
  id: string;
}

/* ============================== */
export interface Mesa {
  num_mesa: number;
  fecha_atencion: string;
  ocupado: boolean;
  pedidos: {
    pizzas: [];
    bebidas: [];
    rolls: [];
    calzone: [];
    extras: [];
  };
}
