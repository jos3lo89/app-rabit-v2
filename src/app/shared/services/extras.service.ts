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
import { Observable } from 'rxjs';
import { Extras, ExtrasDb } from '../interfaces/extras.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ExtrasService {
  private _fireStore = inject(Firestore);
  private _uplaodService = inject(UploadImageService);
  private _collName = 'extras';

  constructor() {}

  async addExtras(data: Extras, foto: string) {
    try {
      const imgUrl = await this._uplaodService.uploadImage(foto);

      if (!imgUrl) return null;

      const collRef = collection(this._fireStore, this._collName);

      return await addDoc(collRef, {
        ...data,
        image: imgUrl,
      });
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  listingExtras(): Observable<ExtrasDb[]> {
    const collRef = collection(this._fireStore, this._collName);

    return new Observable((observer) => {
      getDocs(collRef)
        .then((qrySnapShot) => {
          const items = qrySnapShot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as ExtrasDb;
          });

          observer.next(items);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  gettingExtraWithId(id: string): Observable<ExtrasDb> {
    const coleccionReferencia = doc(this._fireStore, `extras/${id}`);
    return new Observable((observer) => {
      getDoc(coleccionReferencia)
        .then((querySnapShot) => {
          const item = {
            id: querySnapShot.id,
            ...querySnapShot.data(),
          } as ExtrasDb;
          observer.next(item);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
