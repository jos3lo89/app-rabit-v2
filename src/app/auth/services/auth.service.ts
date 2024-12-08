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
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RolesService } from 'src/app/shared/services/roles.service';

export interface UserdocData {
  apellido: string;
  rol: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auht = inject(Auth);
  private _fireStore = inject(Firestore);
  private _rolesService = inject(RolesService);

  constructor() {}

  get authState$(): Observable<User | null> {
    return authState(this._auht);
  }

  async cerrarSesion() {
    this._rolesService.clearRole();

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
    const userFound = await signInWithEmailAndPassword(
      this._auht,
      user.email,
      user.password
    );

    const docRef = doc(this._fireStore, `usuarios/${userFound.user.uid}`);
    const userDoc = await getDoc(docRef);

    const data = userDoc.data() as UserdocData;

    this._rolesService.setRole(data['rol']);

    return userFound;
  }

  async loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();
    return await signInWithPopup(this._auht, googleProvider);
  }
}
