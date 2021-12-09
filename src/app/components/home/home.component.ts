import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sideToSee: string = 'red';

  isUserLogged: boolean = false;

  constructor(private router: Router, private localStorage: LocalStorageService, private userService: UsersService) { }

  ngOnInit(): void {
    this.isUserLogged = this.localStorage.isUserLog();
  }

  seeSide(side: string) {
    this.sideToSee = side;
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  logout() {
    this.userService.logout();
    window.location.reload();
  }

}
