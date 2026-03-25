import { Activity } from "./activity.model";
import { Hotel } from "./hotel.model";

export interface Destination {
    id: string;
    name: string;
    country: string;
    continent: string;
    description: string;
    imageUrl: string;
    climate: 'tropical' | 'temperate' | 'arid' | 'polar';
    bestSeasons: string[];
    tags: string[];
    latitude: number;
    longitude: number;
    averageRating: number;

    hotels: Hotel[];
    activities: Activity[];
}