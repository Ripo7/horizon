import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MoralisService } from 'src/app/services/moralis.service';
import { UsersService } from 'src/app/services/users.service';

declare const window: any;
declare const weiAmount: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sideToSee: string = 'red';
  showButton = false;

  constructor(private router: Router, 
    private localStorage: LocalStorageService, 
    private userService: UsersService,
    private contractService: ContractService,
    private morService: MoralisService) {
    }


  ngOnInit(): void {
  }
  
  seeSide(side: string) {
    this.sideToSee = side;
  }

  goToLogin() {
    this.morService.loginWithMetamask();
  }

  logout() {
    this.morService.logout();
  }

  pay() {
    this.contractService.sendPayment('yo', 1);
  }

  getUserUserLogged() {
    return this.morService.getUserLogged();
  }

}
