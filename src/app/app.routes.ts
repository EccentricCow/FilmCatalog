import { Routes } from '@angular/router';
import { Films } from './views/films/films';

export const routes: Routes = [
  { path: '', redirectTo: 'films', pathMatch: 'full' },
  {
    path: 'films',
    component: Films,
  },
];
