import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuth = false;
  selectedBanca: string = ''; 
  currentUser: User | null = null;
  bancas: string[] = ['Todas','FINEP', 'Fundect', 'FAPESC', 'FAPERGS']; 
  router: Router = inject(Router);
  private inactivityTimer: any;
  private inactivityTimeout = 5 * 60 * 1000; 

  constructor(private auth: Auth) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isAuth = true;
        this.currentUser = user;
        localStorage.setItem('credencial', JSON.stringify({ email: user.email, uid: user.uid }));
        this.startInactivityTimer();
      } else {
        this.isAuth = false;
        this.currentUser = null;
        localStorage.removeItem('credencial');
        this.clearInactivityTimer();
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
        console.error("Erro ao deslogar:", err);
      });
  }

  private startInactivityTimer() {
    this.clearInactivityTimer(); 
    this.inactivityTimer = setTimeout(() => {
      this.realizarLogout();
    }, this.inactivityTimeout);
  }

  private clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  resetInactivityTimer() {
    if (this.isAuth) {
      this.startInactivityTimer();
    }
  }
}
