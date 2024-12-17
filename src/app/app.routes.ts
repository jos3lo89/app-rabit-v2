import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes/auth.routes'),
  },
  {
    canActivateChild: [authGuard()],
    path: 'private',
    loadChildren: () => import('./routes/private.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./routes/public.routes'),
  },
];
