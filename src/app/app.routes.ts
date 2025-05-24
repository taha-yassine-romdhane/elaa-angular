import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MakeupComponent } from './makeup/makeup.component';
import { PhilosophieComponent } from './philosophie/philosophie.component';
import { CollectionComponent } from './collection/collection.component';
import { PannierComponent } from './pannier/pannier.component';
import { ParfumsComponent } from './parfums/parfums.component';
import { MissDiorComponent } from './miss-dior/miss-dior.component';
import { SoinDeVisageComponent } from './soin-de-visage/soin-de-visage.component';
import { CorpsBainComponent } from './corps-bain/corps-bain.component';
import { CheveuxComponent } from './cheveux/cheveux.component';
import { CadeauxComponent } from './cadeaux/cadeaux.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  { path: 'makeup', component: MakeupComponent },
  { path: 'philosophie', component: PhilosophieComponent },
  { path: 'soin-de-visage', component: SoinDeVisageComponent },
  { path: 'collection', component: CollectionComponent },
  { path: 'pannier', component: PannierComponent },
  { path: 'parfums', component: ParfumsComponent },
  { path: 'miss-dior', component: MissDiorComponent },
  { path: 'parfum', component: ParfumsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'corps-bain', component: CorpsBainComponent },
  { path: 'cheveux', component: CheveuxComponent },
  { path: 'cadeaux', component: CadeauxComponent },
];