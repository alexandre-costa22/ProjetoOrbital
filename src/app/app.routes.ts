import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './modules/main-page/main-page.component';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { RegisterBancaComponent } from './modules/register-banca/register-banca.component';
import { RegisterEditaisComponent } from './modules/register-editais/register-editais.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToMain = () => redirectLoggedInTo(['main']);

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    ...canActivate(redirectLoggedInToMain) 
  },
  { 
    path: 'register', 
    component: RegisterComponent, 
    ...canActivate(redirectLoggedInToMain) 
  },
  { 
    path: 'register-banca', 
    component: RegisterBancaComponent, 
    ...canActivate(redirectUnauthorizedToLogin) 
  },
  { 
    path: 'register-editais', 
    component: RegisterEditaisComponent, 
    ...canActivate(redirectUnauthorizedToLogin) 
  },
  { 
    path: 'main', 
    component: MainPageComponent, 
    ...canActivate(redirectUnauthorizedToLogin) 
  },
  { 
    path: '', 
    redirectTo: 'main', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: 'main'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
