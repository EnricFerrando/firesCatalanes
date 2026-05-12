import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Fair } from '../../../interface/fair';
import { FiraService } from '../../../model/fira.service';

@Component({
  selector: 'app-fair-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fair-list.html',
  styleUrls: ['./fair-list.css'],
})
export class FairListComponent implements OnInit {
  selectedRegion: string | null = null;
  fairs: Fair[] = [];
  filteredFairs: Fair[] = [];
  favorites: Fair[] = [];
  p: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private firaService: FiraService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadFavorites();
  }

  async loadData(): Promise<void> {
    try {
      this.fairs = await this.firaService.getFiresFromJson();
      this.route.paramMap.subscribe(params => {
        this.selectedRegion = params.get('region');
        if (this.selectedRegion) {
          this.filteredFairs = this.fairs.filter(
            (fair) => fair.region === this.selectedRegion
          );
          this.p = 1; // Reset pagination
          this.cdr.markForCheck();
        }
      });
    } catch (error) {
      console.error('Error loading fairs:', error);
      this.fairs = [];
      this.filteredFairs = [];
      this.cdr.markForCheck();
    }
  }

  get paginatedFairs(): Fair[] {
    const startIndex = (this.p - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredFairs.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredFairs.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.p = page;
  }

  loadFavorites(): void {
    this.favorites = this.firaService.getFavorites();
  }

  isFavorite(fair: Fair): boolean {
    return this.favorites.some(f => f.name === fair.name && f.town === fair.town);
  }

  toggleFavorite(fair: Fair): void {
    if (!this.isFavorite(fair)) {
      this.firaService.addToFavorites(fair);
      this.loadFavorites(); // Recarreguem per actualitzar l'estat del botó
    }
  }

  goToDetails(fair: Fair): void {
    this.router.navigate(['/fairs', this.selectedRegion, encodeURIComponent(fair.name)]);
  }
}
