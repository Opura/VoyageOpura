import { Routes } from '@angular/router';

import { Homepage } from './features/homepage/homepage';

export const routes: Routes = [
    {
        path: '',
        component: Homepage,
    },
    {
        path: 'voyages',
        loadComponent: () => import('./features/voyages/voyages-list/voyages-list').then(m => m.VoyagesList),
    },
    {
        path: 'voyages/search',
        loadComponent: () => import('./features/voyages/search-results/search-results').then(m => m.SearchResults),
    },
    {
        path: 'voyages/:id',
        loadComponent: () => import('./features/voyages/voyage-detail/voyage-detail').then(m => m.VoyageDetail),
    },
    {
        path: 'destinations',
        loadComponent: () => import('./features/destinations/destinations-list/destinations-list').then(m => m.DestinationsList),
    },
    {
        path: 'destinations/:id',
        loadComponent: () => import('./features/destinations/destination-detail/destination-detail').then(m => m.DestinationDetail),
    },
    {
        path: 'favoris',
        loadComponent: () => import('./features/favoris/favoris').then(m => m.Favoris),
    }

];
