import { Routes } from '@angular/router';

export default [
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login.page'),
  },
  {
    path: 'register',
    loadComponent: () => import('../pages/register/register.page'),
  },
] as Routes;
