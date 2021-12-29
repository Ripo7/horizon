import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { BattleComponent } from './components/battle/battle.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MyTroopersComponent } from './components/my-troopers/my-troopers.component';
import { RulesComponent } from './components/rules/rules.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  // { path: 'mint', component: HomeTronComponent },
  //{ path: 'mint', component: HomeEthComponent },
  { path: 'home', component: HomeComponent },
  { path: 'my-troopers', canActivate: [AuthGuard], component: MyTroopersComponent },
  { path: 'battle', canActivate: [AuthGuard], component: BattleComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo:  '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
