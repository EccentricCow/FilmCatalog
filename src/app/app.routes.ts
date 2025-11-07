import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'films', pathMatch: 'full' },
  {
    path: 'films',
    loadChildren: () => import('./views/films/films.routes').then((m) => m.FilmsRoutes),
  },
];
