import { Component, inject } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: false
})
export class HeaderComponent {

    isAuth: boolean = true;
    currentUser: User | null = null;
    private inactivityTimer: any;
    private inactivityTimeout = 5 * 60 * 1000;
    router: Router = inject(Router);

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

    logOut(){
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
