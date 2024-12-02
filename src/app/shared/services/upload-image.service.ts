import { inject, Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  private _storage = inject(Storage);

  constructor() {}

  async uploadImage(image: string) {
    try {
      const { base64String, contentType } = this.imageDestructuring(image);

      const imgRef = ref(this._storage, `images/${Date.now()}`);
      const uploadResult = await uploadString(imgRef, base64String, 'base64', {
        contentType,
      });

      return await getDownloadURL(uploadResult.ref);
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  private imageDestructuring(image: string) {
    const base64Parts = image.split(';base64,');
    const contentType = base64Parts[0].split(':')[1];
    const base64String = base64Parts[1];

    return { contentType, base64String };
  }

  async takeImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source,
      });

      if (!image.dataUrl) return null;

      return image.dataUrl;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
