import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FiraService } from '../../../model/fira.service';
import { Fair } from '../../../interface/fair';

@Component({
  selector: 'app-fair-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fair-details.html',
  styleUrls: ['./fair-details.css'],
})
export class FairDetailsComponent implements OnInit {
  fair: Fair | null = null;
  region: string = '';
  fairName: string = '';
  loading: boolean = true;
  isFavoritedItem: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firaService: FiraService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.region = params['region'];
      this.fairName = decodeURIComponent(params['fairName']);
      await this.loadFairDetails();
    });
  }

  async loadFairDetails() {
    this.loading = true;
    try {
      const fairs = await this.firaService.getFiresFromJson();
      this.fair = fairs.find(f => 
        f.name === this.fairName && f.region === this.region
      ) || null;
      
      if (this.fair) {
        this.isFavoritedItem = this.firaService.getFavorites().some(
          f => f.name === this.fair!.name && f.town === this.fair!.town
        );
      }
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading fair details:', error);
    } finally {
      this.loading = false;
    }
  }

  toggleFavorite() {
    if (!this.fair) return;
    
    if (this.isFavoritedItem) {
      this.firaService.removeFromFavorites(this.fair);
    } else {
      this.firaService.addToFavorites(this.fair);
    }
    this.isFavoritedItem = !this.isFavoritedItem;
  }

  goBack() {
    this.router.navigate(['/fairs', this.region]);
  }
}
