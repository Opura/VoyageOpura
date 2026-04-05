import { Routes } from '@angular/router';

export const VOYAGES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./voyages-list/voyages-list').then(m => m.VoyagesList),
    },
    {
        path: 'search',
        redirectTo: '',
        pathMatch: 'full',
    },
    {
        path: ':id',
        loadComponent: () => import('./voyage-detail/voyage-detail').then(m => m.VoyageDetail),
    }
];