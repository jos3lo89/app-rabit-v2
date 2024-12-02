export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  nombre: string;
  apellido: string;
  rol: 'admin' | 'user';
}
