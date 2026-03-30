import { Routes } from '@angular/router';

export const VOYAGES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./voyages-list/voyages-list').then(m => m.VoyagesList),
    },
    {
        path: 'search',
        loadComponent: () => import('./search-results/search-results').then(m => m.SearchResults),
    },
    {
        path: ':id',
        loadComponent: () => import('./voyage-detail/voyage-detail').then(m => m.VoyageDetail),
    }
];