import { Component, inject, OnDestroy } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false
})
export class HeaderComponent  {

  isAuth: boolean = true;
  currentUser: User | null = null;
  router: Router = inject(Router);

  constructor(private auth: Auth) { }

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isAuth = true;
        this.currentUser = user;
        localStorage.setItem('credencial', JSON.stringify({ email: user.email, uid: user.uid }));
      } else {
        this.isAuth = false;
        this.currentUser = null;
        localStorage.removeItem('credencial');
      }
    });
  }

  logOut() {
    signOut(this.auth)
      .then(() => {
        this.isAuth = false;
        localStorage.removeItem('credencial');
        this.router.navigate(['/main']);
      })
      .catch((err) => {
        console.error("Erro ao deslogar:", err);
      });
  }

}
