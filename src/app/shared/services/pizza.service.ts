import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';
import { UploadImageService } from './upload-image.service';
import { PizzaDb } from '../interfaces/pizza.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PizzaService {
  private _fireStore = inject(Firestore);
  private _uploadImageService = inject(UploadImageService);
  private collectionName = 'pizzas';
  constructor() {}

  async uploadPizza(pizza: any, image: string) {
    try {
      const imgUrl = await this._uploadImageService.uploadImage(image);

      if (!imgUrl) {
        return null;
      }
      const pizzaRef = collection(this._fireStore, this.collectionName);
      return await addDoc(pizzaRef, {
        ...pizza,
        image: imgUrl,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  listingPizzas(): Observable<PizzaDb[]> {
    const collRef = collection(this._fireStore, this.collectionName);

    return new Observable((observer) => {
      getDocs(collRef)
        .then((qrysnapshot) => {
          const items = qrysnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as PizzaDb;
          });

          observer.next(items);
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  gettingPizzaWithId(id: string): Observable<PizzaDb> {
    const coleccionReferencia = doc(this._fireStore, `pizzas/${id}`);
    return new Observable((observer) => {
      getDoc(coleccionReferencia)
        .then((querySnapShot) => {
          const item = {
            id: querySnapShot.id,
            ...querySnapShot.data(),
          } as PizzaDb;
          observer.next(item);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
