import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Fair } from '../interface/fair';
import { FAIRS } from './fairs';

interface RawFair {
  activityName: string;
  municipalityName: string;
  regionName: string;
  date: string;
  products: string;
}

@Injectable({
  providedIn: 'root'
})
export class FiraService {
  private firesCache: Fair[] | null = null;

  constructor(private http: HttpClient) { }

  private transformRawData(rawFairs: any[]): Fair[] {
    return rawFairs.map(raw => ({
      name: raw.activityName || 'Unknown',
      town: raw.municipalityName || 'Unknown',
      region: raw.regionName || 'Unknown',
      date: this.parseDate(raw.date),
      product: raw.products || 'Unknown',
      organizerName: raw.organizerName || '',
      organizerAddress: raw.organizerAddress || '',
      organizerPhone: raw.organizerPhone || '',
      organizerFax: raw.organizerFax || '',
      email: raw.email || '',
      web: raw.web || '',
      periodicityName: raw.periodicityName || '',
      sectorName: raw.sectorName || '',
      location: raw.location || '',
      firstYear: raw.firstYear || '',
      nexhibitors: raw.nexhibitors,
      nvisitors: raw.nvisitors,
      surface: raw.surface
    }));
  }

  private parseDate(dateStr: string): string {
    if (!dateStr) return '';
    
    // Handle format like "29 Novembre 2025" or "2 - 4 Maig 2025"
    const months: { [key: string]: string } = {
      'gener': '01', 'febrer': '02', 'març': '03', 'abril': '04',
      'maig': '05', 'juny': '06', 'juliol': '07', 'agost': '08',
      'setembre': '09', 'octubre': '10', 'novembre': '11', 'desembre': '12'
    };

    // Try to extract day, month, year from the text format
    const regex = /(\d{1,2})\s+(\w+)\s+(\d{4})/;
    const match = dateStr.match(regex);
    
    if (match) {
      const day = match[1].padStart(2, '0');
      const monthName = match[2].toLowerCase();
      const year = match[3];
      const month = months[monthName] || '01';
      return `${year}-${month}-${day}`;
    }

    return dateStr;
  }

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
      const rawData = await firstValueFrom(this.http.get<RawFair[]>('assets/fairs.json'));
      const transformedData = this.transformRawData(rawData);
      this.firesCache = transformedData;
      return transformedData;
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
