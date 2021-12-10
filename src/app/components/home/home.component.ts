import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
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

  isUserLogged: boolean = false;

  constructor(private router: Router, 
    private localStorage: LocalStorageService, 
    private userService: UsersService,
    private contractService: ContractService) { }

  ngOnInit(): void {
    this.isUserLogged = this.localStorage.isUserLog();
  }

  seeSide(side: string) {
    this.sideToSee = side;
    console.log("consweiAmount", weiAmount);
  }

  goToLogin() {
    //  this.router.navigate(['login']);
    
    this.contractService.openMetamask().then(data => {
      if (data) {
        this.localStorage.set('address', data);
      }
    });
  }

  logout() {
    this.userService.logout();
    window.location.reload();
  }

  pay() {
    this.contractService.sendPayment('yo', 1);
  }

}
