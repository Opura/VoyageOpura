import { Destination } from "./destination.model";

export interface Voyage {
  id: string;                  // uuid
    title: string;
    destinationId: string;
    category: 'adventure' | 'luxury' | 'family' | 'cultural' | 'beach' | 'sport';
    price: number;
    duration: number;            // jours
    departureDate: string;       // ISO date
    returnDate: string;          // ISO date
    availableSeats: number;
    totalSeats: number;
    description: string;
    highlights: string[];
    included: string[];
    excluded: string[];
    imageUrls: string[];
    difficultyLevel: 'easy' | 'medium' | 'hard';
    isPromoted: boolean;
    averageRating: number;       // 0–5
    createdAt: string;
    destination: Destination;    // relation nestée
}