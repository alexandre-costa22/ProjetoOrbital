import { Component, OnInit, inject } from '@angular/core';
import { Auth, onAuthStateChanged, User, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  birthDate: string;
}

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css'],
  standalone: true,
  imports: [ CommonModule, FormsModule, MatProgressSpinnerModule ],
  providers: [DatePipe]
})
export class UserSettingsComponent implements OnInit {

  auth: Auth = inject(Auth);
  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);

  isLoading: boolean = true;
  userProfile: UserProfile | null = null;
  
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  profileSuccessMessage: string | null = null;
  profileErrorMessage: string | null = null;
  passwordSuccessMessage: string | null = null;
  passwordErrorMessage: string | null = null;

  constructor() { }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loadUserData(user.uid);
      } else {
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  async loadUserData(uid: string) {
    this.isLoading = true;
    const userDocRef = doc(this.firestore, `users/${uid}`);
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        this.userProfile = docSnap.data() as UserProfile;
      } else {
        this.profileErrorMessage = "Não foi possível encontrar os dados do utilizador.";
      }
    } catch (error) {
      this.profileErrorMessage = "Ocorreu um erro ao carregar os seus dados.";
    } finally {
      this.isLoading = false;
    }
  }

  async saveSettings() {
    if (!this.userProfile) return;

    this.profileSuccessMessage = null;
    this.profileErrorMessage = null;
    const userDocRef = doc(this.firestore, `users/${this.userProfile.uid}`);

    try {
      await updateDoc(userDocRef, { name: this.userProfile.name });
      this.profileSuccessMessage = "Dados salvos com sucesso!";
    } catch (error) {
      this.profileErrorMessage = "Ocorreu um erro ao salvar as alterações.";
    }
  }

  async changePassword() {
    this.passwordSuccessMessage = null;
    this.passwordErrorMessage = null;

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.passwordErrorMessage = "As novas senhas não coincidem.";
      return;
    }

    const user = this.auth.currentUser;
    if (!user || !user.email) {
      this.passwordErrorMessage = "Utilizador não encontrado. Por favor, faça login novamente.";
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, this.passwordData.currentPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, this.passwordData.newPassword);
      this.passwordSuccessMessage = "Senha alterada com sucesso!";
      this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    } catch (error) {
      this.passwordErrorMessage = "A senha atual está incorreta ou ocorreu um erro.";
      console.error(error);
    }
  }
}
