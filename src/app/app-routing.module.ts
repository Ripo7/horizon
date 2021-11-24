import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BattleComponent } from './components/battle/battle.component';
import { HomeComponent } from './components/home/home.component';
import { MyTroopersComponent } from './components/my-troopers/my-troopers.component';
import { RulesComponent } from './components/rules/rules.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'my-troopers', component: MyTroopersComponent },
  { path: 'battle', component: BattleComponent },
  { path: 'rules', component: RulesComponent },
  { path: '**', redirectTo:  '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
