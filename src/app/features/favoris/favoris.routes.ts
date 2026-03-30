import { Routes } from '@angular/router';

export const FAVORIS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./favoris').then(m => m.Favoris),
    }
];