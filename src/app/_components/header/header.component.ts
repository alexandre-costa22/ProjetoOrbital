import { Component, inject, OnDestroy } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false
})
export class HeaderComponent implements OnDestroy {

  isAuth: boolean = true;
  currentUser: User | null = null;
  private inactivityTimer: any;
  private inactivityTimeout = 5 * 60 * 1000; // 5 minutos
  router: Router = inject(Router);

  private userActivityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

  constructor(private auth: Auth) { }

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isAuth = true;
        this.currentUser = user;
        localStorage.setItem('credencial', JSON.stringify({ email: user.email, uid: user.uid }));
        this.setupActivityListeners();
        this.startInactivityTimer();
      } else {
        this.isAuth = false;
        this.currentUser = null;
        localStorage.removeItem('credencial');
        this.clearInactivityTimer();
        this.removeActivityListeners();
      }
    });
  }

  private setupActivityListeners() {
    this.userActivityEvents.forEach(event =>
      window.addEventListener(event, this.resetTimer)
    );
  }

  private removeActivityListeners() {
    this.userActivityEvents.forEach(event =>
      window.removeEventListener(event, this.resetTimer)
    );
  }

  private resetTimer = () => {
    this.clearInactivityTimer();
    this.startInactivityTimer();
  };

  private startInactivityTimer() {
    this.clearInactivityTimer();
    this.inactivityTimer = setTimeout(() => {
      this.logOut();
    }, this.inactivityTimeout);
  }

  private clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  logOut() {
    this.removeActivityListeners();
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

  ngOnDestroy() {
    this.clearInactivityTimer();
    this.removeActivityListeners();
  }
}
