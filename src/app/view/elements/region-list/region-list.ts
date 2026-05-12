import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Fair } from '../../../interface/fair';
import { FiraService } from '../../../model/fira.service';

@Component({
  selector: 'app-region-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './region-list.html',
  styleUrls: ['./region-list.css']
})
export class RegionListComponent implements OnInit {
  private allFairs: Fair[] = [];
  regions: string[] = [];
  filteredRegions: string[] = [];

  constructor(private firaService: FiraService, private cdr: ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    try {
      this.allFairs = await this.firaService.getFiresFromJson();
      const allRegions = this.allFairs.map(fair => fair.region);
      this.regions = [...new Set(allRegions)].sort();
      this.filteredRegions = [...this.regions];
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading fairs:', error);
      this.regions = [];
      this.filteredRegions = [];
      this.cdr.markForCheck();
    }
  }

  onSearchChange(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (!searchTerm) {
      this.filteredRegions = [...this.regions];
      return;
    }

    // Filtrem les fires que coincideixen amb el terme de cerca
    const matchingFairs = this.allFairs.filter(fair => 
      fair.name.toLowerCase().includes(searchTerm)
    );
    // Obtenim les comarques úniques d'aquestes fires
    const regionsWithMatchingFairs = new Set<string>(matchingFairs.map(fair => fair.region));
    
    this.filteredRegions = [...regionsWithMatchingFairs].sort();
  }
}
