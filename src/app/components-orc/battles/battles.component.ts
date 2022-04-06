import { Component, OnInit } from '@angular/core';
import { pipe } from 'rxjs';
import { BattleService } from 'src/app/services/battle.service';

@Component({
  selector: 'app-battles',
  templateUrl: './battles.component.html',
  styleUrls: ['./battles.component.scss']
})
export class BattlesComponent implements OnInit {

  constructor(private battleService: BattleService) { }

  showMyBattle = false;
  showCreateBattle = false;
  showJoinBattle = false;

  showDetailBattle = false;

  selectedBattle: any;

  battleToJoin: Array<any> = [];

  ngOnInit(): void {

  }

  show(pannelToShow: string, battle?: any) {
    switch(pannelToShow) {
      case 'join':
        this.showJoinBattle = true;
        this.showDetailBattle = false;
        this.battleService.getBattleToJoin().pipe().subscribe((respBattle: any) => {
          console.log("respBattle", respBattle);
          this.battleToJoin = respBattle;
        });
        break;
      case 'my-battles':
        this.showMyBattle = true;
        break;
      case 'create':
        this.showCreateBattle = true;
        break;
      case 'detail':
          this.showDetailBattle = true;
          this.showJoinBattle = false;
          if (battle) {
            this.selectedBattle = battle;
          }
          break;
      default:
        this.showMyBattle = false;
        this.showCreateBattle = false;
        this.showJoinBattle = false;
        this.showDetailBattle = false;
        break;
    }
  }

}
