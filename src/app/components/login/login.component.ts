import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = '';

  password: string = '';

  constructor(private userService: UsersService,  private localStorage: LocalStorageService) { }

  ngOnInit(): void {
  }

  login() {
    console.log("email", this.email);
    console.log("password", this.password);
    this.userService.login({ email: this.email, password: this.password})
  }

}
