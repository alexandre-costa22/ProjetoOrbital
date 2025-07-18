import { Component, HostListener, inject, Injectable, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environments';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoriteItemsService {
  private dadosSource = new BehaviorSubject<any>({});
  dados$ = this.dadosSource.asObservable();

  atualizarDados(dados: any) {
    this.dadosSource.next(dados);
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit {
  isAuth = false;
  selectedBanca: string = '';
  currentUser: User | null = null;
  bancas: string[] = ['Todas', 'FINEP', 'Fundect', 'FAPESC', 'FAPERGS'];
  router: Router = inject(Router);

  arrayFavItems: any[] = [];


  constructor(private auth: Auth,
  private favoriteItemsService: FavoriteItemsService ){}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isAuth = true;
        this.currentUser = user;
        localStorage.setItem(
          'credencial',
          JSON.stringify({ email: user.email, uid: user.uid })
        );
        this.obterUidsUsuarios()
      } else {
        this.isAuth = false;
        this.currentUser = null;
        localStorage.removeItem('credencial');
      }
    });
  }

  realizarLogout() {
    signOut(this.auth)
      .then(() => {
        this.isAuth = false;
        localStorage.removeItem('credencial');
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        console.error('Erro ao deslogar:', err);
      });
  }

  hideLayout(): boolean {
    return ['/login', '/register'].includes(this.router.url);
  }

  async obterUidsUsuarios(){
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app);
    const auth = getAuth();
  
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("Usuário não está logado ou email indisponível");
    }
  
    const emailLogado = user.email;
  
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", emailLogado));
  
    const querySnapshot = await getDocs(q);
  
    const uids = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return data['uid'];  
    });

    const favoriteItems = collection(db, "favoriteItems");
    const qFav = query(favoriteItems, where("userId", "==", uids[0]));

    const querySnapshotFav = await getDocs(qFav);
    const favItems = querySnapshotFav.docs.map(item => {
      const data = item.data();
      return data;  
    });

    this.arrayFavItems = favItems

    console.log(this.arrayFavItems)

    this.favoriteItemsService.atualizarDados(this.arrayFavItems);
  }
}
