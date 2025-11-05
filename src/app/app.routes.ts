import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'films', pathMatch: 'full' },
      {
        path: 'films',
        loadChildren: () => import('./views/films/films.routes').then((m) => m.FilmsRoutes),
      },
    ],
  },
];
