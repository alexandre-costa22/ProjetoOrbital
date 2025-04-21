import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './_components/main-page/main-page.component';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';
import { LoginComponent } from './_components/login/login.component';
import { RegisterComponent } from './_components/register/register.component';

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
    path: 'main', 
    component: MainPageComponent, 
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
