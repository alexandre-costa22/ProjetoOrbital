import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

// IMPORTS NECESSÁRIOS PARA O TEMPLATE
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor, etc.
import { RouterModule } from '@angular/router'; // Para [routerLink]
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Para <mat-spinner>
import { FavoriteItemsService } from '../../app.component';
// Removi a importação do seu pipe customizado por enquanto para simplificar a correção

// Interface para padronizar os itens favoritados
export class FavoriteItem {
  id: string = ''
  name: string = ''
  type: string = ''
  imageUrl: string = ''
}

interface DadosFavorito {
  userId: string;
  itemId: string;
  itemCateg: string;
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
    private firestore: Firestore,
    private favoriteItemsService: FavoriteItemsService
  ) { }

  ngOnInit(): void {
    this.favoriteItemsService.dados$.subscribe(data => {
      for(let i = 0; i < data.length; i++){
          const item = new FavoriteItem();
          item.id = data[i].userId;
          item.name = data[i].itemId;
          item.type = data[i].itemCateg;
        
          this.favoriteMissions.push(item);
      }
    });
    
    console.log(this.favoriteMissions)
    
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