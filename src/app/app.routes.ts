import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './_components/main-page/main-page.component';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';
import { LoginComponent } from './_components/login/login.component';
import { RegisterComponent } from './_components/register/register.component';
import { MissionsComponent } from './_components/missions/missions.component';
import { ItemDescriptionComponent } from './_components/item-description/item-description.component';
import { LaunchesComponent } from './_components/launches/launches.component';
import { AstronautsComponent } from './_components/astronauts/astronauts.component';

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
    path: 'missions',
    component: MissionsComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'launches',
    component: LaunchesComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
    {
    path: 'astronauts',
    component: AstronautsComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'item/:name',
    component: ItemDescriptionComponent
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
