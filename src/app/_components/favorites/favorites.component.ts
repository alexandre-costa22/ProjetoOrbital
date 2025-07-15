import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

// IMPORTS NECESSÁRIOS PARA O TEMPLATE
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor, etc.
import { RouterModule } from '@angular/router'; // Para [routerLink]
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Para <mat-spinner>
// Removi a importação do seu pipe customizado por enquanto para simplificar a correção

// Interface para padronizar os itens favoritados
interface FavoriteItem {
  id: string;
  name: string;
  type: 'mission' | 'spaceship' | 'astronaut';
  imageUrl: string;
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: true, // É importante marcar como standalone
  imports: [
    CommonModule, // Adicionado
    RouterModule, // Adicionado
    MatProgressSpinnerModule // Adicionado
    // Se você tiver o pipe 'translateMission', adicione-o aqui também. Ex: TranslateMissionPipe
  ]
})
export class FavoritesComponent implements OnInit {

  isLoading: boolean = true;
  currentUser: User | null = null;

  // Arrays para cada categoria de favorito
  favoriteMissions: FavoriteItem[] = [];
  favoriteSpaceships: FavoriteItem[] = [];
  favoriteAstronauts: FavoriteItem[] = [];

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) { }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user;
        this.fetchFavorites(user.uid);
      } else {
        this.isLoading = false;
        console.log("Nenhum usuário logado para buscar favoritos.");
      }
    });
  }

  async fetchFavorites(userId: string) {
    this.isLoading = true;
    setTimeout(() => {
      this.loadMockData();
      this.isLoading = false;
    }, 1500);
  }

  loadMockData() {
    this.favoriteMissions = [
      { id: 'exp68', name: 'Expedition 68', type: 'mission', imageUrl: 'assets/icons/expedition.jpeg' },
      { id: 'crew-5', name: 'Crew-5', type: 'mission', imageUrl: 'assets/icons/expedition.jpeg' }
    ];
    this.favoriteSpaceships = [
      { id: 'dragon', name: 'Crew Dragon', type: 'spaceship', imageUrl: 'assets/icons/spaceship.jpeg' }
    ];
    this.favoriteAstronauts = [
       { id: 'astro1', name: 'Raja Chari', type: 'astronaut', imageUrl: 'assets/icons/astronaut.jpeg' },
       { id: 'astro2', name: 'Thomas Marshburn', type: 'astronaut', imageUrl: 'assets/icons/astronaut.jpeg' },
       { id: 'astro3', name: 'Kayla Barron', type: 'astronaut', imageUrl: 'assets/icons/astronaut.jpeg' }
    ];
  }
}