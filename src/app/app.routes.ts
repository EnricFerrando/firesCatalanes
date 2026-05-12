import { Routes } from '@angular/router';
import { RegionListComponent } from './view/elements/region-list/region-list';
import { FairListComponent } from './view/elements/fair-list/fair-list';
import { FavoritesListComponent } from './view/elements/favorites-list/favorites-list';

export const routes: Routes = [
  { path: '', redirectTo: '/regions', pathMatch: 'full' },
  { path: 'regions', component: RegionListComponent },
  { path: 'fairs/:region', component: FairListComponent },
  { path: 'favorites', component: FavoritesListComponent },
];