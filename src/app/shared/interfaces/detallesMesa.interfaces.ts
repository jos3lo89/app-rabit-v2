import { CartDb } from './cart.interfaces';

export enum EntregaMesa {
  PENDIENTE = 'pendiente',
  ENTREGADO = 'entregado',
}

export interface DetallesMesa {
  id_mesa: string;
  entrega: EntregaMesa;
  productos: CartDb[];
}

export interface DetallesMesaDb extends DetallesMesa {
  id: string;
}
