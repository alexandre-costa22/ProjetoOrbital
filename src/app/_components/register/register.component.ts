import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {
  auth: Auth = inject(Auth);
  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);

  usuario: any = {
    name: '',
    birthDate: '',
    email: '',
    senha: ''
  };

  constructor() { }

  async createUser() {
    if (!this.usuario.email || !this.usuario.senha || !this.usuario.name || !this.usuario.birthDate) {
      console.error('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.usuario.email,
        this.usuario.senha
      );
      const user = userCredential.user;

      const userDocRef = doc(this.firestore, `users/${user.uid}`);

      await setDoc(userDocRef, {
        uid: user.uid,
        email: this.usuario.email,
        name: this.usuario.name,
        birthDate: this.usuario.birthDate,
        createdAt: new Date()
      });

      this.router.navigate(['/login']);

    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
    }
  }
}