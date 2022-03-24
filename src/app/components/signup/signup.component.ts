import { Component, OnInit } from '@angular/core';
import { MoralisService } from 'src/app/services/moralis.service';
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
  constructor(private userService: UsersService, private moralisService: MoralisService) { }

  ngOnInit(): void {
  }

  // signup() {
  //   this.userService.signup({email: this.email, password: this.password, pseudo: this.pseudo}).subscribe((res) => {
  //     if (res) {
  //       this.userService.login({email: this.email, password: this.password});
  //     }
  //   })
  // }

  signupWithEmail() {
    return this.moralisService.signupWithEmmail(this.pseudo, this.password).then((resp) => {
    })
  }
}
