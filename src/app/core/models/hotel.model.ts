export interface Hotel {
    id: string;
    destinationId: string;
    name: string;
    stars: number;               // 1–5
    pricePerNight: number;
    description: string;
    amenities: string[];
    address: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
}