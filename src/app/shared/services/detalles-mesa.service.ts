import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  DetallesMesa,
  DetallesMesaDb,
} from '../interfaces/detallesMesa.interfaces';
import * as dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class DetallesMesaService {
  private _firestore = inject(Firestore);

  private _colName = 'detalles-mesa';

  constructor() {}

  async addDetails(data: DetallesMesa) {
    try {
      const collRef = collection(this._firestore, this._colName);

      await addDoc(collRef, {
        ...data,
        fecha: dayjs().toISOString(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getDetailWithId(id_mesa: string) {
    try {
      const collRef = collection(this._firestore, this._colName);

      const q = query(collRef, where('id_mesa', '==', id_mesa));

      const qrySnap = await getDocs(q);

      const docs = qrySnap.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as DetallesMesaDb;
      });

      if (docs.length === 0) {
        return null;
      }

      return docs[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async changeStateMesa(
    detalles: {
      id_detalles: string;
      estado_detalles: string;
    }
    // mesa: {
    //   id_mesa: string;
    //   estado_mesa: string;
    // }
  ) {
    try {
      const docRef2 = doc(
        this._firestore,
        `detalles-mesa/${detalles.id_detalles}`
      );
      await updateDoc(docRef2, {
        entrega: detalles.estado_detalles,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async changeStateMesapp(mesa: { id_mesa: string; estado_mesa: string }) {
    try {
      const docRef = doc(this._firestore, `mesas/${mesa.id_mesa}`);
      await updateDoc(docRef, {
        estado: mesa.estado_mesa,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDoc(id: string) {
    try {
      const docRef = doc(this._firestore, `${this._colName}/${id}`);
      await deleteDoc(docRef);
    } catch (error) {
      console.log(error);
    }
  }
}
