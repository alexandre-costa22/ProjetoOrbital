import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routes';
import { LoginComponent } from './_components/login/login.component';
import { MainPageComponent } from './_components/main-page/main-page.component';
import { CommonModule, NgFor, NgForOf, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../environments/environments';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './_components/register/register.component';
import { PaginatePipe } from './pipe/paginate.pipe';
import { FooterComponent } from './_components/footer/footer.component';
import { HeaderComponent } from './_components/header/header.component';
import { provideHttpClient } from '@angular/common/http';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TranslateMissionPipe } from './pipe/translate-mission.pipe';
import { MissionsComponent } from './_components/missions/missions.component';
import { ItemDescriptionComponent } from './_components/item-description/item-description.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainPageComponent,
    RegisterComponent,
    PaginatePipe,
    FooterComponent,
    HeaderComponent,
    TranslateMissionPipe,
    MissionsComponent,
    ItemDescriptionComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    FormsModule,
    NgSelectModule,
    NgForOf,
    NgFor,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    CarouselModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  providers: [
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)), 
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }