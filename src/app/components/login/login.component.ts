import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MoralisService } from 'src/app/services/moralis.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = '';

  password: string = '';

  constructor(private userService: UsersService,  private localStorage: LocalStorageService, private moralisService: MoralisService) { }

  ngOnInit(): void {
  }

  login() {
    this.userService.login({ email: this.email, password: this.password})
  }

  loginWithSolana() {

    this.moralisService.loginSolana().then(data => { {
    }})
  }

}
