import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-my-troopers',
  templateUrl: './my-troopers.component.html',
  styleUrls: ['./my-troopers.component.scss']
})
export class MyTroopersComponent implements OnInit {

  connectedUser :any;
  showTrooper: boolean = false;
  doEditTroopName: boolean = false;
  trooperToShow: any = null;

  newTrooperName: string = '';

  constructor(private usersService: UsersService, private localStorage: LocalStorageService) { }

  ngOnInit(): void {
    this.usersService.getUserInfo(JSON.parse(JSON.stringify(this.localStorage.get('userId')))).subscribe((userInfo: any) => {
      this.connectedUser = userInfo[0];
    })
  }

  showTrooperDetails(trooper: any) {
    this.showTrooper = true;
    this.trooperToShow = trooper;
  }

  backShowTrooper() {
    this.showTrooper = false;
    this.trooperToShow = null;
    this.doEditTroopName = false;
  }

}
