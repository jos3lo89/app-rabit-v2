import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';
import { Mesa, MesaDb, MesaRegister } from '../interfaces/mesa.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MesasService {
  private _fireStore = inject(Firestore);
  private _collName = 'mesas';

  constructor() {}

  async registrarMesa(data: MesaRegister) {
    try {
      const collRef = collection(this._fireStore, this._collName);

      return await addDoc(collRef, data);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  gettingMesas(): Observable<MesaDb[]> {
    const collRef = collection(this._fireStore, this._collName);

    return new Observable((observer) => {
      getDocs(collRef)
        .then((qrySnapShot) => {
          const items = qrySnapShot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as MesaDb;
          });
          observer.next(items);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  async getMesa(id: string): Promise<MesaDb> {
    const docRef = doc(this._fireStore, `mesas/${id}`);

    const aqySnap = await getDoc(docRef);

    return { id: aqySnap.id, ...aqySnap.data() } as MesaDb;
  }
}
