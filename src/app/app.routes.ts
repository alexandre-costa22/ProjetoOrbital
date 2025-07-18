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
import { SpaceshipsComponent } from './_components/spaceships/spaceships.component';
import { FavoritesComponent } from './_components/favorites/favorites.component';
import { UserSettingsComponent } from './_components/user-settings/user-settings.component';
import { OrbitalLiveComponent } from './_components/orbital-live/orbital-live.component';
import { NotFoundComponent } from './_components/not-found/not-found.component';

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
  },
  {
    path: 'launches',
    component: LaunchesComponent,
  },
  {
    path: 'spaceships',
    component: SpaceshipsComponent,
  },
  {
    path: 'astronauts',
    component: AstronautsComponent,
  },
  {
    path: 'orbital-live',
    component: OrbitalLiveComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'favoriteItems',
    component: FavoritesComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'userSettings',
    component: UserSettingsComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'item/:name',
    component: ItemDescriptionComponent,
    ...canActivate(redirectUnauthorizedToLogin)
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
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
