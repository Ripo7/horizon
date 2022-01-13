import { Component, OnInit } from '@angular/core';
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

  currentBattle: any;
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

  constructor(private battleService: BattleService, 
    private userService: UsersService, 
    private db: AngularFirestore,
    private moralisService: MoralisService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();
    this.loadBattle();
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
      let indexElda = this.currentBattle.data.elda.findIndex((el: any) => el === currNFT.idToken);
      let indexDemetos = this.currentBattle.data.demetos.findIndex((el: any) => el === currNFT.idToken);
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
    this.currentUserNFT = [];
    this.battleService.getBattleRealTime().pipe(first()).subscribe(currBattle => {
      this.currentBattle = currBattle[0];
        this.currentBattle.data.elda.forEach(async (element: any) => {
          const metaData = await this.moralisService.getTroopersByIdToken(element).toPromise();
          this.teamElda.push(metaData[0].data);
        });
        this.currentBattle.data.demetos.forEach(async (element: any) => {
          const metaData = await this.moralisService.getTroopersByIdToken(element).toPromise();
          this.teamDemetos.push(metaData[0].data);
        });
        this.loaderTroopDetails = false;
      console.log("this.currentBattle", this.currentBattle);
      this.moralisService.getUserNFTs().then(nftObs => {
        let count = 0;
        nftObs?.forEach(nft => {
          nft.then((data: any) => {
            let tmpData = data[0].data
            this.currentUserNFT.push(tmpData);
            count ++;
            if (count === nftObs.length) {
              this.userAlreadyInBattle();
            }
          })
        })
      });
    })
  }

  trooperAlreadyInTeam(trooper: any, team: string) {
    let trooperInTeam = false;
    let indexTroop;
    if (team === 'elda') {
      indexTroop = this.currentBattle.data.elda.findIndex((el: any) => el === trooper.idToken);
    }
    if (team === 'demetos') {
      indexTroop = this.currentBattle.data.demetos.findIndex((el: any) => el === trooper.idToken);
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
    this.trooperToAdd.forEach(element => {
      this.battleService.addToTeam(this.teamToAddTo, element.idToken)
    });
    this.showModaljoin = false;
    this.teamToAddTo = null;
    this.loadBattle();
    this.trooperToAdd = [];
  }

  validateRemoveTrooper() {
    this.trooperToRemove.forEach(element => {
      this.battleService.remoteFromTeam(this.teamToRemoveFrom, element.idToken)
    });
    this.trooperToAdd.forEach(element => {
      this.battleService.addToTeam(this.teamToRemoveFrom, element.idToken)
    });
    this.showModalRemove = false;
    this.teamToRemoveFrom = null;
    this.loadBattle();
    this.trooperToRemove = [];
    this.trooperToAdd = [];
  }

  teamCount(team: string) {
    let count = 0;
    if (team === 'elda') {
      this.currentBattle.data.elda.forEach((element: any) => {
        count++;
      });
    }
    if (team === 'demetos') {
      this.currentBattle.data.demetos.forEach((element: any) => {
        count++;
      });
    }
    return count;
  }

  seeTrooperDetails(trooper: any) {
    this.trooperToSeeDetails = trooper;
    console.log("this.trooperToSeeDetails", this.trooperToSeeDetails);
    this.showModalDetails = true;
  } 

  backDetailsTrooper() {
    this.trooperToSeeDetails = null;
    this.showModalDetails = false;
  }
}


