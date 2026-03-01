export interface Review {
    id: string;
    voyageId: string;
    authorName: string;
    rating: number;              // 1–5
    title: string;
    comment: string;
    createdAt: string;
}