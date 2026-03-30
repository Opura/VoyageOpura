import { Routes } from '@angular/router';

import { Homepage } from './features/homepage/homepage';

export const routes: Routes = [
    {
        path: '',
        component: Homepage,
    },
    {
        path: 'voyages',
        loadChildren: () => import('./features/voyages/voyages.routes').then(m => m.VOYAGES_ROUTES),
    },
    {
        path: 'destinations',
        loadChildren: () => import('./features/destinations/destinations.routes').then(m => m.DESTINATIONS_ROUTES),
    },
    {
        path: 'favoris',
        loadChildren: () => import('./features/favoris/favoris.routes').then(m => m.FAVORIS_ROUTES),
    }

];
