import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavorisServices {
  
  storageKey = 'favoris';

  saveToStorage(ids: string[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(ids));
  }

  favoriteIds = signal<string[]>(this.getFavoriteIdsFromStorage());

  getFavoriteIdsFromStorage(): string[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }

  favoritesCount = computed(() => this.favoriteIds().length);

  toggleFavorite(id: string): void {
    this.favoriteIds.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
    this.saveToStorage(this.favoriteIds());
  }

  isFavorite(id: string): boolean {
    return this.favoriteIds().includes(id);
  }

}

