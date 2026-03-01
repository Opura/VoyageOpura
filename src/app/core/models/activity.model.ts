export interface Activity {
    id: string;
    destinationId: string;
    name: string;
    description: string;
    category: 'culture' | 'sport' | 'gastronomy' | 'nature' | 'nightlife' | 'adventure';
    duration: number;            // heures
    price: number;
    imageUrl: string;
    minParticipants: number;
    maxParticipants: number;
}