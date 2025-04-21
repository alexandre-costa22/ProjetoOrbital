import { inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, User } from '@angular/fire/auth';

import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  auth: Auth = inject(Auth);
  usuario: any = { email: "", senha: "" };

  constructor() {}

  async register(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error; 
    }
  }
}
