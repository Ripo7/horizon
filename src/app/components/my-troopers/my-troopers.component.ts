import { Component, OnInit } from '@angular/core';
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

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.connectedUser = this.usersService.getConnectedUser();
    console.log("this.connectedUser", this.connectedUser);
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

  editTrooperName() {
    this.doEditTroopName = true;
  }

  validNewTroopName() {
    console.log("this.newTrooperName", this.newTrooperName);
    this.usersService.setTrooperName(this.trooperToShow.id,  this.newTrooperName);
    this.doEditTroopName = false;
    this.newTrooperName = '';
  }

  cancelNewTroopName() {
    this.doEditTroopName = false;
    this.newTrooperName = '';
  }

}
