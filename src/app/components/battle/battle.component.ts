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

  mapAccessoryScore: Map<any, any> = new Map([
    [ "Excalibur", { att: 100 } ],
    [ "Drone", { att: 95 }  ],
    [ "Tesla", { att: 90 }  ],
    [ "Hatchet", { att: 85 } ],
    [ "Katana", { att: 80 }  ],
    [ "Dagger", { att: 75 }  ],
    [ "None", { att: 70 } ]
]);

  mapArmorScore: Map<any, any> = new Map([
    [ "God", { def: 200 } ],
    [ "Eltriangle", { def: 190 }  ],
    [ "Furiosa", { def: 180 }  ],
    [ "E19", { def: 170 } ],
    [ "Carapace", { def: 160 }  ],
    [ "Commander", { def: 150 }  ],
    [ "Yorfury", { def: 140 } ],
    [ "Legatus", { def: 130 } ]
]);

  mapVisorScore: Map<any, any> = new Map([
    [ "Sun", { spe: 100 } ],
    [ "Odin", { spe: 95 }  ],
    [ "Cody", { spe: 90 }  ],
    [ "Kramer", { spe: 85 } ],
    [ "Fisher", { spe: 80 }  ],
    [ "Bigbrother", { spe: 75 }  ],
    [ "Apple", { spe: 70 } ],
    [ "Cyclope", { spe: 65 } ]
]);

mapHelmetScore: Map<any, any> = new Map([
  [ "Maya", { def: 200 } ],
  [ "Lucifer", { def: 190 }  ],
  [ "Hunter", { def: 180 }  ],
  [ "Hood", { def: 170 } ],
  [ "Oni", { def: 160 }  ],
  [ "Iroquois", { def: 150 }  ],
  [ "Aqua", { def: 140 } ],
  [ "Sol", { def: 130 } ]
]);

mapRespiratorScore: Map<any, any> = new Map([
  [ "Oxygen", { spe: 100 } ],
  [ "1418", { spe: 95 }  ],
  [ "Doof", { spe: 90 }  ],
  [ "Mrtube", { spe: 85 } ],
  [ "Abe", { spe: 80 }  ],
  [ "Flask", { spe: 75 }  ],
  [ "Liang", { spe: 70 } ],
  [ "Maximus", { spe: 65 } ]
]);

mapGemScore: Map<any, any> = new Map([
  [ "Tiger", { spe: 100 } ],
  [ "Tear", { spe: 95 }  ],
  [ "Square", { spe: 90 }  ],
  [ "Triforce", { spe: 85 } ],
  [ "Emerald", { spe: 80 }  ],
  [ "Star", { spe: 75 }  ]
]);

mapSupportGemScore: Map<any, any> = new Map([
  [ "Unique", { att: 100, def: 200 } ],
  [ "Rocket", { att: 95, def: 190 }  ],
  [ "Airship", { att: 90, def: 180 }  ],
  [ "System", { att: 85, def: 170 } ],
  [ "Uka", { att: 80, def: 160 }  ],
  [ "Loop", { att: 75, def: 150 }  ],
  [ "Cable", { att: 70, def: 140 } ],
  [ "Spider", { att: 65, def: 130 }  ]
]);


mapColorScore: Map<any, any> = new Map([
  [ "Gold", { att: 100, def: 200 } ],
  [ "Black", { att: 60, def: 120 }  ],
  [ "White", { att: 30, def: 60 }  ],
]);

mapEmmissiveColorScore: Map<any, any> = new Map([
  [ "Fire", { att: 100, def: 200 } ],
  [ "Blue Sky", { att: 100, def: 200 }  ],
  [ "Green", { att: 95, def: 190 }  ],
  [ "Dark Blue", { att: 90, def: 180 } ],
  [ "Orange", { att: 85, def: 170 }  ],
  [ "Purple", { att: 80, def: 160 }  ],
  [ "Pink", { att: 75, def: 150 } ],
  [ "Light Blue", { att: 70, def: 140 }],
  [ "Red", { att: 65, def: 130 }  ]
]);

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
      if (this.currentBattle.data.locked) {
        this.currentBattle.data.elda.forEach(async (element: any) => {
          const metaData = await this.moralisService.getOpenSeaMetadata(element);
          this.teamElda.push(metaData);
        });
        this.currentBattle.data.demetos.forEach(async (element: any) => {
          const metaData = await this.moralisService.getOpenSeaMetadata(element);
          this.teamDemetos.push(metaData);
        });
        setTimeout(() => {
          this.calculateAllTrooperScore();
        }, 1000)
      }
      console.log("this.currentBattle", this.currentBattle);
      this.moralisService.getUserNFTs().then(nftObs => {
        let count = 0;
        nftObs?.forEach(nft => {
          nft.then((data: any) => {
            let tmpData = {
              trooperName: data.name,
              idToken: data.token_id,
              traits: data.traits,
              image: data.image_preview_url
            }
            this.currentUserNFT.push(tmpData);
            count ++;
            if (count === nftObs.length) {
              this.userAlreadyInBattle();
              this.calculateTroopScore();
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

  calculateTroopScore() {
    this.currentUserNFT.forEach(eld => {
      let colorScore: any;
      let emissiveColorScore: any;
      let armorScore: any;
      let accessoryScore: any;
      let visorScore: any;
      let respiratorScore: any;
      let gemScore: any;
      let supportGemScore: any;
      let helmetScore: any;
      eld.traits.forEach((tr: any) => {
        if (tr.trait_type === 'Color') {
          colorScore = this.mapColorScore.get(tr.value);
        }
        if (tr.trait_type === 'Emissive Color') {
          emissiveColorScore = this.mapEmmissiveColorScore.get(tr.value);
        }
        if (tr.trait_type === 'Armor') {
          armorScore = this.mapArmorScore.get(tr.value);
        }
        if (tr.trait_type === 'Accessory') {
          accessoryScore = this.mapAccessoryScore.get(tr.value);
        }
        if (tr.trait_type === 'Gem') {
          gemScore = this.mapGemScore.get(tr.value);
        }
        if (tr.trait_type === 'Support Gem') {
          supportGemScore = this.mapSupportGemScore.get(tr.value);
        }
        if (tr.trait_type === 'Visor') {
          visorScore = this.mapVisorScore.get(tr.value);
        }
        if (tr.trait_type === 'Respirator') {
          respiratorScore = this.mapRespiratorScore.get(tr.value);
        }
        if (tr.trait_type === 'Helmet Top') {
          helmetScore = this.mapHelmetScore.get(tr.value);
        }
      });
      let attScore = accessoryScore.att + supportGemScore.att + colorScore.att + emissiveColorScore.att;

      let defScore = helmetScore.def + supportGemScore.def + colorScore.def + emissiveColorScore.def + armorScore.def;

      let speScore = visorScore.spe + respiratorScore.spe + gemScore.spe;

      eld.att = attScore;
      eld.def = defScore;
      eld.spe = speScore;

    });
  }

  calculateAllTrooperScore() {
    this.teamElda.forEach(eld => {
      let colorScore: any;
      let emissiveColorScore: any;
      let armorScore: any;
      let accessoryScore: any;
      let visorScore: any;
      let respiratorScore: any;
      let gemScore: any;
      let supportGemScore: any;
      let helmetScore: any;
      eld.traits.map((tr: any) => {
        if (tr.trait_type === 'Color') {
          colorScore = this.mapColorScore.get(tr.value);
        }
        if (tr.trait_type === 'Emissive Color') {
          emissiveColorScore = this.mapEmmissiveColorScore.get(tr.value);
        }
        if (tr.trait_type === 'Armor') {
          armorScore = this.mapArmorScore.get(tr.value);
        }
        if (tr.trait_type === 'Accessory') {
          accessoryScore = this.mapAccessoryScore.get(tr.value);
        }
        if (tr.trait_type === 'Gem') {
          gemScore = this.mapGemScore.get(tr.value);
        }
        if (tr.trait_type === 'Support Gem') {
          supportGemScore = this.mapSupportGemScore.get(tr.value);
        }
        if (tr.trait_type === 'Visor') {
          visorScore = this.mapVisorScore.get(tr.value);
        }
        if (tr.trait_type === 'Respirator') {
          respiratorScore = this.mapRespiratorScore.get(tr.value);
        }
        if (tr.trait_type === 'Helmet Top') {
          helmetScore = this.mapHelmetScore.get(tr.value);
        }
      });
      let attScore = accessoryScore.att + supportGemScore.att + colorScore.att + emissiveColorScore.att;

      let defScore = helmetScore.def + supportGemScore.def + colorScore.def + emissiveColorScore.def + armorScore.def;

      let speScore = visorScore.spe + respiratorScore.spe + gemScore.spe;

      eld.att = attScore;
      eld.def = defScore;
      eld.spe = speScore;
      return eld;
    });

    this.teamDemetos.map(eld => {
      let colorScore: any;
      let emissiveColorScore: any;
      let armorScore: any;
      let accessoryScore: any;
      let visorScore: any;
      let respiratorScore: any;
      let gemScore: any;
      let supportGemScore: any;
      let helmetScore: any;
      eld.traits.forEach((tr: any) => {
        if (tr.trait_type === 'Color') {
          colorScore = this.mapColorScore.get(tr.value);
        }
        if (tr.trait_type === 'Emissive Color') {
          emissiveColorScore = this.mapEmmissiveColorScore.get(tr.value);
        }
        if (tr.trait_type === 'Armor') {
          armorScore = this.mapArmorScore.get(tr.value);
        }
        if (tr.trait_type === 'Accessory') {
          accessoryScore = this.mapAccessoryScore.get(tr.value);
        }
        if (tr.trait_type === 'Gem') {
          gemScore = this.mapGemScore.get(tr.value);
        }
        if (tr.trait_type === 'Support Gem') {
          supportGemScore = this.mapSupportGemScore.get(tr.value);
        }
        if (tr.trait_type === 'Visor') {
          visorScore = this.mapVisorScore.get(tr.value);
        }
        if (tr.trait_type === 'Respirator') {
          respiratorScore = this.mapRespiratorScore.get(tr.value);
        }
        if (tr.trait_type === 'Helmet Top') {
          helmetScore = this.mapHelmetScore.get(tr.value);
        }
      });
      let attScore = accessoryScore.att + supportGemScore.att + colorScore.att + emissiveColorScore.att;

      let defScore = helmetScore.def + supportGemScore.def + colorScore.def + emissiveColorScore.def + armorScore.def;

      let speScore = visorScore.spe + respiratorScore.spe + gemScore.spe;

      eld.att = attScore;
      eld.def = defScore;
      eld.spe = speScore;
      return eld;
    });
    this.loaderTroopDetails = false;
  }
}
