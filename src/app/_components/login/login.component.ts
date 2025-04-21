import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Auth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private provider = new GoogleAuthProvider();
  auth: Auth = inject(Auth);
  user$: Observable<User | null> = new Observable((subscriber) => {
    const unsubscribe = onAuthStateChanged(this.auth, (user) => {
      subscriber.next(user);
    });
    return () => unsubscribe();
  });

  usuario: any = { email: "", senha: "" };
  @Output() onLoginEvent = new EventEmitter<User | null>();
  router: Router = inject(Router);
  erroLogin: boolean = false;
  mensagemErro: string = '';
  carregando: boolean = false; 

  constructor() {}

  async realizarLoginComEmailSenha() {
    this.carregando = true;
    this.erroLogin = false;
    this.mensagemErro = '';
    try {
      const { email, senha } = this.usuario;
      if (!email || !senha) {
        this.erroLogin = true;
        this.mensagemErro = "Por favor, preencha todos os campos.";
        return;
      }
      const userCredential = await signInWithEmailAndPassword(this.auth, email, senha);
      const user = userCredential.user;
      this.onLoginEvent.emit(user);
      this.router.navigate(['/']);
    } catch (error) {
      this.erroLogin = true;
      this.mensagemErro = this.formatarMensagemErro(error);
      console.error("Erro no login com email/senha:", error);
    } finally {
      this.carregando = false;
    }
  }

  private formatarMensagemErro(error: any): string {
    if (error.code === 'auth/wrong-password') {
      return "Senha incorreta.";
    } else if (error.code === 'auth/user-not-found') {
      return "Usuário não encontrado.";
    } else if (error.code === 'auth/invalid-email') {
      return "Email inválido.";
    } else {
      return "Erro ao realizar o login. Tente novamente mais tarde.";
    }
  }
}
