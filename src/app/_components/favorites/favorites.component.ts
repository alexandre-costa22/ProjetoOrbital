import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

// IMPORTS NECESSÁRIOS PARA O TEMPLATE
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor, etc.
import { RouterModule } from '@angular/router'; // Para [routerLink]
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Para <mat-spinner>
import { FavoriteItemsService } from '../../app.component';
import { ExpeditionService } from '../../services/expeditions.service';
import { finalize, forkJoin } from 'rxjs';
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
  standalone: true,
  imports: [
    CommonModule, // Adicionado
    RouterModule, // Adicionado
    MatProgressSpinnerModule // Adicionado
  ]
})
export class FavoritesComponent implements OnInit {

  isLoading: boolean = false;
  currentUser: User | null = null;

  uid: string = '';

  favoriteItemImages: { [id: string]: string } = {}; 

  favoriteMissions: FavoriteItem[] = [];
  favoriteSpaceships: FavoriteItem[] = [];
  favoriteAstronauts: FavoriteItem[] = [];

  constructor(                
    private auth: Auth,
    private firestore: Firestore,
    private favoriteItemsService: FavoriteItemsService,
    private expeditionService: ExpeditionService
  ) { }

  ngOnInit(): void {
    this.favoriteItemsService.dados$.subscribe(data => {
      this.favoriteMissions = [];
      this.favoriteSpaceships = [];
      this.favoriteAstronauts = [];
  
      for (let i = 0; i < data.arrayFavItems.length; i++) {
        const item = new FavoriteItem();
        item.id = data.arrayFavItems[i].userId;
        item.name = data.arrayFavItems[i].itemId;
        item.type = data.arrayFavItems[i].itemCateg;
  
        switch (item.type) {
          case 'expedition':
            this.favoriteMissions.push(item);
            break;
          case 'astronauts':
            this.favoriteAstronauts.push(item);
            break;
          case 'spacecraft':
            this.favoriteSpaceships.push(item);
            break;
        }
      }
      this.uid = data.uids[0];
    });


      const photoObservables = this.favoriteMissions.map(expedition =>
        this.expeditionService.getCrewPhoto(expedition.name)
          );
    
        if (photoObservables.length > 0) {
          forkJoin(photoObservables).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          ).subscribe(results => {
            results.forEach((url, i) => {
              this.favoriteItemImages[this.favoriteMissions[i].name] = url || 'assets/default.jpg';
            });
          });
        } else {
          this.isLoading = false;
        }



    
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.isLoading = false;
        console.log("Nenhum usuário logado para buscar favoritos.");
      }
    });
  }

  ngOnChanges(){
    this.favoriteItemsService.dados$.subscribe(data => {
      this.favoriteMissions = [];
      this.favoriteSpaceships = [];
      this.favoriteAstronauts = [];
  
      for (let i = 0; i < data.arrayFavItems.length; i++) {
        const item = new FavoriteItem();
        item.id = data.arrayFavItems[i].userId;
        item.name = data.arrayFavItems[i].itemId;
        item.type = data.arrayFavItems[i].itemCateg;
  
        switch (item.type) {
          case 'expedition':
            this.favoriteMissions.push(item);
            break;
          case 'astronauts':
            this.favoriteAstronauts.push(item);
            break;
          case 'spacecraft':
            this.favoriteSpaceships.push(item);
            break;
        }
      }
      this.uid = data.uids[0];
    });
  }

  getImage(id: string): string {
    return this.favoriteItemImages[id] || 'assets/default-astronaut.jpg';
  }


}