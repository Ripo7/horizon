import { Component, OnInit } from '@angular/core';
import { MoralisService } from 'src/app/services/moralis.service';

@Component({
  selector: 'app-header-orc',
  templateUrl: './header-orc.component.html',
  styleUrls: ['./header-orc.component.scss']
})
export class HeaderOrcComponent implements OnInit {

  constructor (private moralisService: MoralisService) { }

  ngOnInit(): void {
  }

  getUserLogged() {
    return this.moralisService.getUserLogged();
  }

  // goToLoginWallet() {
  //   this.morService.loginWalletConnect();
  // }

  goToLoginSolana() {
    this.moralisService.loginSolana();
  }

  logout() {
    this.moralisService.logout();
  }

  getUserUserLogged() {
    return this.moralisService.getUserLogged();
  }

}
