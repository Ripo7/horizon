import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { MyTroopersComponent } from './components/my-troopers/my-troopers.component';
import { BattleComponent } from './components/battle/battle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RulesComponent } from './components/rules/rules.component';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeEthComponent } from './components/home-eth/home-eth.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MyTroopersComponent,
    BattleComponent,
    RulesComponent,
    SignupComponent,
    LoginComponent,
    HomeEthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
