import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BattleService } from 'src/app/services/battle.service';
import { UsersService } from 'src/app/services/users.service';
import { distinctUntilChanged, first, last, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MoralisService } from 'src/app/services/moralis.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {

  @Input() currentBattle: any;
  @Output() validEmit = new EventEmitter();
  currentUserNFT: any[] = [];

  loaderTroopDetails = true;

  showModaljoin = false;
  showModalRemove = false;

  trooperToAdd: any[] = [];
  trooperToRemove: any[] = [];

  teamToAddTo: any;
  teamToRemoveFrom: any;

  teamElda: any[] = [];
  teamDemetos: any[] = [];

  showModalDetails = false;
  trooperToSeeDetails: any;

  loader = true;

  validatedTroopers: any[] = [];

  constructor(private battleService: BattleService, 
    private userService: UsersService, 
    private db: AngularFirestore,
    private moralisService: MoralisService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.moralisService.getUserNFTs().then(nftObs => {
      let count = 0;
      nftObs?.forEach(nft => {
        nft.then((data: any) => {
          if (data[0]) {
            let tmpData = data[0].data
            this.currentUserNFT.push(tmpData);
          }
          count ++;
          if (count === nftObs.length) {
            this.loadBattle();
          }
        })
      })
    });
  }

  loadUserNft() {
    
  }

  openModalJoin(team: string) {
    this.showModaljoin = true;
    this.teamToAddTo = team;
  }

  openModalRemove(team: string) {
    this.showModalRemove = true;
    this.teamToRemoveFrom = team;
  }

  backAddTrooper() {
    this.showModaljoin = false;
    this.teamToAddTo = null;
    this.trooperToAdd = [];
  }

  backRemoveTrooper() {
    this.showModalRemove = false;
    this.teamToRemoveFrom = null;
    this.trooperToRemove= [];
  }

  addTrooper(trooper: any) {
    this.trooperToAdd.push(trooper);
  }

  removeTrooperFromAddList(trooper: any) {
    let indexTrooper = this.trooperToAdd.findIndex(el => el.idToken === trooper.idToken);
    this.trooperToAdd.splice(indexTrooper, 1);
  }

  enoughSpaceToAddTroopers() {
    let total = 0;
    if (this.teamToAddTo && !this.teamToRemoveFrom) {
      if (this.teamToAddTo === 'elda') {
        total = this.teamElda.length + this.trooperToAdd.length;
      } else {
        total = this.teamDemetos.length + this.trooperToAdd.length;
      }
    }
    if (!this.teamToAddTo && this.teamToRemoveFrom) {
      if (this.teamToRemoveFrom === 'elda') {
        total = this.teamElda.length + this.trooperToAdd.length - this.trooperToRemove.length;
      } else {
        total = this.teamDemetos.length + this.trooperToAdd.length - this.trooperToRemove.length;
      }
    }
    return total < 10;
  }

  removeTrooperFromRemoveList(trooper: any) {
    let indexTrooper = this.trooperToRemove.findIndex(el => el.idToken === trooper.idToken);
    this.trooperToRemove.splice(indexTrooper, 1);
  }

  removeTrooper(trooper: any) {
    this.trooperToRemove.push(trooper);
  }

  userAlreadyInBattle() {
    let userInElda = false;
    let userInDemetos = false;
    this.currentUserNFT.forEach(currNFT => {
      let indexElda = this.teamElda.findIndex((el: any) => el.idToken === currNFT.idToken);
      let indexDemetos = this.teamDemetos.findIndex((el: any) => el.idToken === currNFT.idToken);
      if (indexElda !== -1) {
        userInElda = true;
      }
      if (indexDemetos !== -1) {
        userInDemetos = true;
      }
    })
    this.loader = false;
    return {
      userInElda,
      userInDemetos
    }
  }

  loadBattle() {
    this.currentBattle.data.elda.forEach((element: any) => {
      this.teamElda.push(element);
    });
    this.currentBattle.data.demetos.forEach((element: any) => {
      this.teamDemetos.push(element);
    });
    this.userAlreadyInBattle();
  }

  validateJoinTrooper() {
    this.loader = true;
    this.battleService.updateBattle(this.currentBattle, this.teamElda, this.teamDemetos);
    this.validEmit.emit('');
  }

  trooperAlreadyInTeam(trooper: any, team: string) {
    let trooperInTeam = false;
    let indexTroop;
    if (team === 'elda') {
      indexTroop = this.teamElda.findIndex((el: any) => el.idToken === trooper.idToken);
    }
    if (team === 'demetos') {
      indexTroop = this.teamDemetos.findIndex((el: any) => el.idToken === trooper.idToken);
    }
    if (indexTroop !== -1) {
      trooperInTeam = true;
    }
    return trooperInTeam;
  }

  trooperIsInTrooperRemoveList(trooper: any) {
    let trooperInList = false;
    let indexTroop;
    indexTroop = this.trooperToRemove.findIndex((el: any) => el.idToken === trooper.idToken);
    if (indexTroop !== -1) {
      trooperInList = true;
    }
    return trooperInList;
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

  validateAddTrooper() {
      if (this.teamToAddTo === 'elda') {
        this.trooperToAdd.forEach(element => {
          this.teamElda.push(element);
        });
      } else if (this.teamToAddTo === 'demetos') {
        this.trooperToAdd.forEach(element => {
          this.teamDemetos.push(element);
        });
    }
    
    this.teamToAddTo = null;
    this.showModaljoin = false;
    this.trooperToAdd = [];
  }

  validateRemoveTrooper() {
    if (this.teamToRemoveFrom === 'elda') {
      this.trooperToRemove.forEach(element => {
        let index = this.teamElda.findIndex(el => el.idToken === element.idToken)
        this.teamElda.splice(index, 1);
      });
      this.trooperToAdd.forEach(element => {
        this.teamElda.push(element)
      });
    } else if (this.teamToRemoveFrom === 'demetos') {
      this.trooperToRemove.forEach(element => {
        let index = this.teamDemetos.findIndex(el => el.idToken === element.idToken)
        this.teamDemetos.splice(index, 1);
      });
      this.trooperToAdd.forEach(element => {
        this.teamDemetos.push(element)
      });
    }
    this.showModalRemove = false;
    this.teamToRemoveFrom = null;
    this.trooperToRemove = [];
    this.trooperToAdd = [];
  }

  teamCount(team: string) {
    let count = 0;
    if (team === 'elda') {
      this.teamElda.forEach((element: any) => {
        count++;
      });
    }
    if (team === 'demetos') {
      this.teamDemetos.forEach((element: any) => {
        count++;
      });
    }
    return count;
  }

  seeTrooperDetails(trooper: any) {
    this.trooperToSeeDetails = trooper;
    this.showModalDetails = true;
  } 

  backDetailsTrooper() {
    this.trooperToSeeDetails = null;
    this.showModalDetails = false;
  }
}


