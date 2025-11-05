import { Routes } from '@angular/router';
import { Films } from './films/films';
import { Film } from './film/film';

export const FilmsRoutes: Routes = [
  { path: '', component: Films },
  { path: ':id', component: Film },
];
