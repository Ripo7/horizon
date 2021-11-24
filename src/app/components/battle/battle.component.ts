import { Component, OnInit } from '@angular/core';
import { BattleService } from 'src/app/services/battle.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {

  currentBattle: any;
  currentUser: any;

  constructor(private battleService: BattleService, private userService: UsersService) { }

  ngOnInit(): void {
    this.currentBattle = this.battleService.getCurrentBattle();
    this.currentUser = this.userService.getConnectedUser();
  }

  addTroopersToTeam(troopers: any[], teamId: string) {
    this.battleService.addTroopersToTeam(troopers, teamId);
  }

  removeTroopersFromTeam(troopers: any[], teamId: string) {
    this.battleService.removeTroopersFromTeam([troopers], teamId);
  }

}
