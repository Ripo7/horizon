import { Component, ChangeDetectorRef } from '@angular/core';
import { MoralisService } from './services/moralis.service';

import { initializeApp } from "firebase/app";

import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hor1zon-civil-war';

  constructor(private moralisService: MoralisService, private cdr: ChangeDetectorRef) {
    this.moralisService.setChangeDetector(cdr);
    initializeApp(environment.firebaseConfig)
  }

  goToLogin() {
    this.moralisService.loginWithMetamask();
  }

  // goToLoginWallet() {
  //   this.morService.loginWalletConnect();
  // }

  // goToLoginSolana() {
  //   this.morService.loginSolana();
  // }

  logout() {
    this.moralisService.logout();
  }

  getUserUserLogged() {
    return this.moralisService.getUserLogged();
  }
  
}
