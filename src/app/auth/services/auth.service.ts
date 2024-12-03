import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from '@angular/fire/auth';
import { UserLogin, UserRegister } from '../models/auth.models';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auht = inject(Auth);
  private _fireStore = inject(Firestore);

  constructor() {}

  get authState$(): Observable<User | null> {
    return authState(this._auht);
  }

  async cerrarSesion() {
    await this._auht.signOut();
  }

  async registrar(user: UserRegister) {
    const newUser = await createUserWithEmailAndPassword(
      this._auht,
      user.email,
      user.password
    );

    const userReference = doc(this._fireStore, `usuarios/${newUser.user.uid}`);
    await setDoc(userReference, {
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol,
    });

    return newUser;
  }

  async login(user: UserLogin) {
    return await signInWithEmailAndPassword(
      this._auht,
      user.email,
      user.password
    );
  }

  async loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();
    return await signInWithPopup(this._auht, googleProvider);
  }
}
