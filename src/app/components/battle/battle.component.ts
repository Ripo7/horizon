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

  teamEldaColorList: any[] = [];
  teamEldaEmissiveColorList: any[] = [];
  teamEldaArmorList: any[] = [];
  teamEldaRespiratorList: any[] = [];
  teamEldaGemList: any[] = [];
  teamEldaSupportGemList: any[] = [];
  teamEldaVisorList: any[] = [];
  teamEldaHelmetTopList: any[] = [];
  teamEldaAccessoryList: any[] = [];

  teamDemetosColorList: any[] = [];
  teamDemetosEmissiveColorList: any[] = [];
  teamDemetosArmorList: any[] = [];
  teamDemetosRespiratorList: any[] = [];
  teamDemetosGemList: any[] = [];
  teamDemetosSupportGemList: any[] = [];
  teamDemetosVisorList: any[] = [];
  teamDemetosHelmetTopList: any[] = [];
  teamDemetosAccessoryList: any[] = [];

  pointAccElda: any = 0;
  pointArmElda: any= 0;
  pointRespElda: any= 0;
  pointVisorElda: any= 0;
  pointSuppGemElda: any = 0;
  pointGemElda: any = 0;
  pointHelmetElda: any = 0;
  pointColorElda: any = 0;
  pointEmissiveColorElda: any = 0;

  pointAccDemetos: any = 0;
  pointArmDemetos: any = 0;
  pointRespDemetos: any = 0;
  pointVisorDemetos: any = 0;
  pointSuppGemDemetos: any = 0;
  pointGemDemetos: any = 0;
  pointHelmetDemetos: any = 0;
  pointColorDemetos: any = 0;
  pointEmissiveColorDemetos: any = 0;

  constructor(private battleService: BattleService, 
    private userService: UsersService, 
    private db: AngularFirestore,
    private moralisService: MoralisService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();
    this.moralisService.getUserNFTs().then(nftObs => {
      let count = 0;
      nftObs?.forEach(nft => {
        nft.then((data: any) => {
          let tmpData = data[0].data
          this.currentUserNFT.push(tmpData);
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
        this.userAlreadyInBattle();
      console.log("this.currentusernft", this.currentUserNFT);
      // this.moralisService.getUserNFTs().then(nftObs => {
      //   let count = 0;
      //   nftObs?.forEach(nft => {
      //     nft.then((data: any) => {
      //       let tmpData = data[0].data
      //       this.currentUserNFT.push(tmpData);
      //       count ++;
      //       if (count === nftObs.length) {
      //         // this.calculateSameAttributesScore();
      //         
      //       }
      //     })
      //   })
      // });
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
    this.loader = true;
    this.trooperToAdd.forEach(element => {
      this.battleService.addToTeam(this.teamToAddTo, element.idToken)
    });
    this.showModaljoin = false;
    this.teamToAddTo = null;
    this.loadBattle();
    this.trooperToAdd = [];
  }

  validateRemoveTrooper() {
    this.loader = true;
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

  calculateSameAttributesScore() {
    this.teamDemetos.map(dem => {
        this.teamDemetosEmissiveColorList.push(dem.emissiveColor);
        this.teamDemetosArmorList.push(dem.armor);
        this.teamDemetosRespiratorList.push(dem.respirator);
        this.teamDemetosAccessoryList.push(dem.accessory);
        this.teamDemetosGemList.push(dem.gem);
        this.teamDemetosSupportGemList.push(dem.supportGem);
        this.teamDemetosHelmetTopList.push(dem.helmet);
        this.teamDemetosVisorList.push(dem.visor);
    });
    this.teamElda.forEach(eld => {
      this.teamEldaEmissiveColorList.push(eld.emissiveColor);
        this.teamEldaArmorList.push(eld.armor);
        this.teamEldaRespiratorList.push(eld.respirator);
        this.teamEldaAccessoryList.push(eld.accessory);
        this.teamEldaGemList.push(eld.gem);
        this.teamEldaSupportGemList.push(eld.supportGem);
        this.teamEldaHelmetTopList.push(eld.helmet);
        this.teamEldaVisorList.push(eld.visor);
    });
    const occEldaVisor = this.teamEldaVisorList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occEldaRespirator = this.teamEldaRespiratorList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occEldaSupportGem = this.teamEldaSupportGemList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occEldaGem = this.teamEldaGemList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occEldaHelmetTop = this.teamEldaHelmetTopList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occEldaAccessory = this.teamEldaAccessoryList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occEldaArmor = this.teamEldaArmorList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occEldaColor = this.teamEldaColorList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occEldaEmissiveColor = this.teamEldaEmissiveColorList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    
    const occDemetosVisor = this.teamDemetosVisorList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occDemetosRespirator = this.teamDemetosRespiratorList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occDemetosSupportGem = this.teamDemetosSupportGemList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occDemetosGem = this.teamDemetosGemList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occDemetosHelmetTop = this.teamDemetosHelmetTopList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occDemetosAccessory = this.teamDemetosAccessoryList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occDemetosArmor = this.teamDemetosArmorList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occDemetosColor = this.teamDemetosColorList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const occDemetosEmissiveColor = this.teamDemetosEmissiveColorList.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const keysEAcc = Object.keys(occEldaAccessory);
    keysEAcc.forEach((element: any) => {
      if(occEldaAccessory[element] > 1 && element !== 'None') {
        this.pointAccElda = this.pointAccElda + occEldaAccessory[element];
      }
    });
    const keysEArm = Object.keys(occEldaArmor);
    keysEArm.forEach((element: any) => {
      if(occEldaArmor[element] > 1 && element !== 'None') {
        this.pointArmElda = this.pointArmElda + occEldaArmor[element];
      }
    });

    const keysEResp = Object.keys(occEldaRespirator);
    keysEResp.forEach((element: any) => {
      if(occEldaRespirator[element] > 1 && element !== 'None') {
        this.pointRespElda = this.pointRespElda + occEldaRespirator[element];
      }
    });

    const keysEVis = Object.keys(occEldaVisor);
    keysEVis
    .forEach((element: any) => {
      if(occEldaVisor[element] > 1 && element !== 'None') {
        this.pointVisorElda = this.pointVisorElda + occEldaVisor[element];
      }
    });
    const keysESuppGem = Object.keys(occEldaSupportGem);
    keysESuppGem.forEach((element: any) => {
      if(occEldaSupportGem[element] > 1 && element !== 'None') {
        this.pointSuppGemElda = this.pointSuppGemElda + occEldaSupportGem[element];
      }
    });
    const keysEGem = Object.keys(occEldaGem);
    keysEGem.forEach((element: any) => {
      if(occEldaGem[element] > 1 && element !== 'None') {
        this.pointGemElda = this.pointGemElda + occEldaGem[element];
      }
    });
    const keysEHelTop = Object.keys(occEldaHelmetTop);
    keysEHelTop.forEach((element: any) => {
      if(occEldaHelmetTop[element] > 1 && element !== 'None') {
        this.pointHelmetElda = this.pointHelmetElda + occEldaHelmetTop[element];
      }
    });
    const keysEColor = Object.keys(occEldaColor);
    keysEColor.forEach((element: any) => {
      if(occEldaColor[element] > 1 && element !== 'None') {
        this.pointColorElda = this.pointColorElda + occEldaColor[element];
      }
    });
    const keysEEmiColor = Object.keys(occEldaEmissiveColor);
    keysEEmiColor.forEach((element: any) => {
      if(occEldaEmissiveColor[element] > 1 && element !== 'None') {
        this.pointEmissiveColorElda = this.pointEmissiveColorElda + occEldaEmissiveColor[element];
      }
    });

    const keysDAcc = Object.keys(occDemetosAccessory);
    keysDAcc.forEach((element: any) => {
      if(occDemetosAccessory[element] > 1 && element !== 'None') {
        this.pointAccDemetos = this.pointAccDemetos + occDemetosAccessory[element];
      }
    });
    const keysDArm = Object.keys(occDemetosArmor);
    keysDArm.forEach((element: any) => {
      if(occDemetosArmor[element] > 1 && element !== 'None') {
        this.pointArmDemetos = this.pointArmDemetos + occDemetosArmor[element];
      }
    });

    const keysDResp = Object.keys(occDemetosRespirator);
    keysDResp.forEach((element: any) => {
      if(occDemetosRespirator[element] > 1 && element !== 'None') {
        this.pointRespDemetos = this.pointRespDemetos + occDemetosRespirator[element];
      }
    });

    const keysDVis = Object.keys(occDemetosVisor);
    keysDVis
    .forEach((element: any) => {
      if(occDemetosVisor[element] > 1 && element !== 'None') {
        this.pointVisorDemetos = this.pointVisorDemetos + occDemetosVisor[element];
      }
    });
    
    const keysDSuppGem = Object.keys(occDemetosSupportGem);
    keysDSuppGem.forEach((element: any) => {
      if(occDemetosSupportGem[element] > 1 && element !== 'None') {
        this.pointSuppGemDemetos = this.pointSuppGemDemetos + occDemetosSupportGem[element];
      }
    });
    const keysDGem = Object.keys(occDemetosGem);
    keysDGem.forEach((element: any) => {
      if(occDemetosGem[element] > 1 && element !== 'None') {
        this.pointGemDemetos = this.pointGemDemetos + occDemetosGem[element];
      }
    });

    const keysDHelTop = Object.keys(occDemetosHelmetTop);
    keysDHelTop.forEach((element: any) => {
      if(occDemetosHelmetTop[element] > 1 && element !== 'None') {
        this.pointHelmetDemetos = this.pointHelmetDemetos + occDemetosHelmetTop[element];
      }
    });


    const keysDColor = Object.keys(occDemetosColor);
    keysDColor.forEach((element: any) => {
      if(occDemetosColor[element] > 1 && element !== 'None') {
        this.pointColorDemetos = this.pointColorDemetos + occDemetosColor[element];
      }
    });
    const keysDEmiColor = Object.keys(occDemetosEmissiveColor);
    keysDEmiColor.forEach((element: any) => {
      if(occDemetosEmissiveColor[element] > 1 && element !== 'None') {
        this.pointEmissiveColorDemetos = this.pointEmissiveColorDemetos + occDemetosEmissiveColor[element];
      }
    });
  }
}


