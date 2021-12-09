import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  email: string = '';

  password: string = '';

  pseudo: string = '';
  constructor(private userService: UsersService) { }

  ngOnInit(): void {
  }

  signup() {
    this.userService.signup({email: this.email, password: this.password, pseudo: this.pseudo}).subscribe((res) => {
      if (res) {
        this.userService.login({email: this.email, password: this.password});
      }
    })
  }
}
