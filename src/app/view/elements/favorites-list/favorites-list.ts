import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fair } from '../../../interface/fair';
import { FiraService } from '../../../model/fira.service';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites-list.html',
  styleUrls: ['./favorites-list.css'],
})
export class FavoritesListComponent implements OnInit {
  favorites: Fair[] = [];

  constructor(private firaService: FiraService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favorites = this.firaService.getFavorites();
  }

  removeFromFavorites(fair: Fair): void {
    this.firaService.removeFromFavorites(fair);
    this.loadFavorites(); // Recarreguem la llista per actualitzar la vista
  }
}
