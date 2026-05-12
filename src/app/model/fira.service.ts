import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Fair } from '../interface/fair';
import { FAIRS } from './fairs';

@Injectable({
  providedIn: 'root'
})
export class FiraService {
  private firesCache: Fair[] | null = null;

  constructor(private http: HttpClient) { }

  getFires(): Fair[] {
    // Return cached data if available
    if (this.firesCache) {
      return this.firesCache;
    }
    // Fallback to hardcoded data
    return FAIRS;
  }

  async getFiresFromJson(): Promise<Fair[]> {
    // If already cached, return immediately
    if (this.firesCache) {
      return this.firesCache;
    }

    try {
      const data = await firstValueFrom(this.http.get<Fair[]>('assets/fairs.json'));
      this.firesCache = data;
      return data;
    } catch (err) {
      console.warn('Failed to load fairs.json, using fallback data', err);
      this.firesCache = FAIRS;
      return FAIRS;
    }
  }

  getFavorites(): Fair[] {
    const favoritesJson = localStorage.getItem('favorites');
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  }

  addToFavorites(fair: Fair): boolean {
    const favorites = this.getFavorites();
    if (!favorites.some(f => f.name === fair.name && f.town === fair.town)) {
      favorites.push(fair);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      return true;
    }
    return false;
  }

  removeFromFavorites(fair: Fair): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(f => !(f.name === fair.name && f.town === fair.town));
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}
