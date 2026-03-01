import { Voyage } from './voyage.model';

export interface VoyagesResponse {
    data: Voyage[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}