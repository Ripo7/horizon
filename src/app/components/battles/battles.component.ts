import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, tap } from 'rxjs/operators';
import { BattleService } from 'src/app/services/battle.service';
import { MoralisService } from 'src/app/services/moralis.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-battles',
  templateUrl: './battles.component.html',
  styleUrls: ['./battles.component.scss']
})
export class BattlesComponent implements OnInit {

  battles: any[] = [];

  battleCreation = false;

  showAddTroopers = false;

  teamToAdd: any = null;

  selectedTeam: any = null;

  trooperToAdd: any[] = [];

  validatedTrooper: any[] = [];
  
  currentUserNFT: any[] = [];

  battleNameText: string = '';

  loader = true;

  showModalJoin = false;
  battleToJoin: any = null;

  constructor(private battleService: BattleService, 
    private userService: UsersService, 
    private db: AngularFirestore,
    private moralisService: MoralisService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.loadBattles();
    
    this.moralisService.getUserNFTs().then(nftObs => {
      nftObs?.forEach(nft => {
        nft.then((data: any) => {
          if (data[0]) {
            let tmpData = data[0].data
            this.currentUserNFT.push(tmpData);
          }
        })
      })
    });
  }

  loadBattles() {
    this.battleService.getBattleNotFinished().pipe(
      first(),
      tap((battles: any) => {
        this.battles = battles;
        this.loader = false;
      })
    ).subscribe();
  }

  showBattleCreation() {
    this.battleCreation = true;
  }

  validateBattle() {
    if (this.battleNameText !== '' && this.validatedTrooper.length !== 0) {
      this.loader = true;
      return this.battleService.createBattle(this.battleNameText, this.validatedTrooper, this.selectedTeam).then(() => {
        this.showAddTroopers = false;
        this.battleCreation = false;
        this.selectedTeam = null;
        this.battleNameText = '';
        this.loadBattles();
        this.validatedTrooper = [];
      });
    } else {
      return null;
    }
  }

  cancelBattleCreation() {
    this.showAddTroopers = false;
    this.battleCreation = false;
    this.selectedTeam = null;
    this.battleNameText = '';
    this.validatedTrooper = [];
  }

  join(team: string) {
    this.showAddTroopers = true;
    this.teamToAdd = team;
  }

  validateAddTrooper() {
    this.trooperToAdd.forEach(element => {
      this.validatedTrooper.push(element);
    });
    this.showAddTroopers = false;
    this.selectedTeam = this.teamToAdd;
    this.teamToAdd = null;
    this.trooperToAdd = [];
  }

  removeTrooperFromAddList(trooper: any) {
    let indexTrooper = this.trooperToAdd.findIndex(el => el.idToken === trooper.idToken);
    this.trooperToAdd.splice(indexTrooper, 1);
  }

  trooperIsInTrooperAddList(trooper: any) {
    let trooperInList = false;
    let indexTroop;
    indexTroop = this.trooperToAdd.findIndex((el: any) => el.idToken === trooper.idToken);
    if (indexTroop !== -1) {
      trooperInList = true;
    }
    return trooperInList;
  }


  addTrooper(trooper: any) {
    this.trooperToAdd.push(trooper);
  }

  backAddTrooper() {
    this.showAddTroopers = false;
    this.teamToAdd = null;
    this.trooperToAdd = [];
    this.showModalJoin = false;
    this.battleToJoin = null;
  }

  trooperAlreadtValidated(trooper: any) {
    let trooperInList = false;
    let indexTroop;
    indexTroop = this.validatedTrooper.findIndex((el: any) => el.idToken === trooper.idToken);
    if (indexTroop !== -1) {
      trooperInList = true;
    }
    return trooperInList;
  }

  deleteTrooperFromValidated(trooper: any) {
    let indexTroop;
    indexTroop = this.validatedTrooper.findIndex((el: any) => el.idToken === trooper.idToken);
    this.validatedTrooper.splice(indexTroop, 1);
  }

  showModalJoinBattle(battle: any) {
    this.showModalJoin = true;
    this.battleToJoin = battle;
  }

  validateJoinTrooper(event: string) {
    this.loader = true;
    this.loadBattles();
    this.showModalJoin = false;
    this.battleToJoin = null;
  }

  enoughSpaceToAddTroopers() {
    let total = this.validatedTrooper.length + this.trooperToAdd.length;
    return total < 10;
  }

}
