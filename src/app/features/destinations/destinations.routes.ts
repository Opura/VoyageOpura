import { Routes } from '@angular/router';

export const DESTINATIONS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./destinations-list/destinations-list').then(m => m.DestinationsList),
    },
    {
        path: ':id',
        loadComponent: () => import('./destination-detail/destination-detail').then(m => m.DestinationDetail),
    }
];