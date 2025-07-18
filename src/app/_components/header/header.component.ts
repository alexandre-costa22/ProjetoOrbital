import { Component, inject } from '@angular/core';
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

  isMenuOpen = false;
  isSearchOpen = false;

  constructor(private auth: Auth) { }

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isAuth = true;
        this.currentUser = user;
      } else {
        this.isAuth = false;
        this.currentUser = null;
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) this.isSearchOpen = false;
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) this.isMenuOpen = false;
  }

  closeMenuAndNavigate() {
    this.isMenuOpen = false;
  }

  logOutAndCloseMenu() {
    this.logOut();
    this.closeMenuAndNavigate();
  }

  logOut() {
    signOut(this.auth)
      .then(() => {
        this.router.navigate(['/main']);
      })
      .catch((err) => {
        console.error("Erro ao deslogar:", err);
      });
  }
}
