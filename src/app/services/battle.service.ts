import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BattleService {

  private battle = {
    id: 0,
    status: 'available',
    winner: null,
    teams: [
      {
        id: "0",
        name: 'Council of Elda',
        troopers: [
          {
            id: "0",
            name: "Troopers 0",
            image: "assets/images/trooper-1.png",
            rarity: 1990,
            status: 'fighting',
            properties: {
              accessory: 'Dagger',
              armor: 'Commander',
              color: 'White',
              emissiveColor: 'Red',
              gem: 'Tear',
              helmetTop: 'Hood',
              respirator: 'Abe',
              supportGem: 'Loop',
              visor: 'Kramer'
            }
          },
          {
            id: "1",
            name: "Trooper 1",
            image: "assets/images/trooper-2.png",
            rarity: 654,
            status: 'ready',
            properties: {
              accessory: 'Tesla',
              armor: 'Commander',
              color: 'Black',
              emissiveColor: 'Pink',
              gem: 'Triforce',
              helmetTop: 'Sol',
              respirator: 'Flask',
              supportGem: 'Uka',
              visor: 'Fisher'
            }
          },
          {
            id: "2",
            name: "Trooper 2",
            image: "assets/images/trooper-2.png",
            rarity: 165,
            status: 'ready',
            properties: {
              accessory: 'Tesla',
              armor: 'Commander',
              color: 'Black',
              emissiveColor: 'Pink',
              gem: 'Triforce',
              helmetTop: 'Sol',
              respirator: 'Flask',
              supportGem: 'Uka',
              visor: 'Fisher'
            }
          },
          {
            id: "3",
            name: "Trooper 3",
            image: "assets/images/trooper-2.png",
            rarity: 5678,
            status: 'ready',
            properties: {
              accessory: 'Tesla',
              armor: 'Commander',
              color: 'Black',
              emissiveColor: 'Pink',
              gem: 'Triforce',
              helmetTop: 'Sol',
              respirator: 'Flask',
              supportGem: 'Uka',
              visor: 'Fisher'
            }
          },
          {
            id: "4",
            name: "Trooper 4",
            image: "assets/images/trooper-2.png",
            rarity: 4618,
            status: 'ready',
            properties: {
              accessory: 'Tesla',
              armor: 'Commander',
              color: 'Black',
              emissiveColor: 'Pink',
              gem: 'Triforce',
              helmetTop: 'Sol',
              respirator: 'Flask',
              supportGem: 'Uka',
              visor: 'Fisher'
            }
          }
        ]
      },
      {
        id: "1",
        name: 'Demetos League',
        troopers: [
          {
            id: "5",
            name: "Trooper 5",
            image: "assets/images/trooper-2.png",
            rarity: 3598,
            status: 'ready',
            properties: {
              accessory: 'Tesla',
              armor: 'Commander',
              color: 'Black',
              emissiveColor: 'Pink',
              gem: 'Triforce',
              helmetTop: 'Sol',
              respirator: 'Flask',
              supportGem: 'Uka',
              visor: 'Fisher'
            }
          },
          {
            id: "5",
            name: "Trooper 5",
            image: "assets/images/trooper-2.png",
            rarity: 4664,
            status: 'ready',
            properties: {
              accessory: 'Tesla',
              armor: 'Commander',
              color: 'Black',
              emissiveColor: 'Pink',
              gem: 'Triforce',
              helmetTop: 'Sol',
              respirator: 'Flask',
              supportGem: 'Uka',
              visor: 'Fisher'
            }
          },
          {
            id: "6",
            name: "Trooper 6",
            image: "assets/images/trooper-2.png",
            rarity: 46,
            status: 'ready',
            properties: {
              accessory: 'Tesla',
              armor: 'Commander',
              color: 'Black',
              emissiveColor: 'Pink',
              gem: 'Triforce',
              helmetTop: 'Sol',
              respirator: 'Flask',
              supportGem: 'Uka',
              visor: 'Fisher'
            }
          },
          {
            id: "7",
            name: "Trooper 7",
            image: "assets/images/trooper-2.png",
            rarity: 2568,
            status: 'ready',
            properties: {
              accessory: 'Tesla',
              armor: 'Commander',
              color: 'Black',
              emissiveColor: 'Pink',
              gem: 'Triforce',
              helmetTop: 'Sol',
              respirator: 'Flask',
              supportGem: 'Uka',
              visor: 'Fisher'
            }
          },
          {
            id: "8",
            name: "Trooper 8",
            image: "assets/images/trooper-2.png",
            rarity: 6999,
            status: 'ready',
            properties: {
              accessory: 'Tesla',
              armor: 'Commander',
              color: 'Black',
              emissiveColor: 'Pink',
              gem: 'Triforce',
              helmetTop: 'Sol',
              respirator: 'Flask',
              supportGem: 'Uka',
              visor: 'Fisher'
            }
          }
        ]
      }
    ]
  }

  constructor() { }

  getCurrentBattle() {
    return this.battle;
  }

  addTroopersToTeam(troopers: any[], teamId: string) {
    this.battle.teams.map(team => {
      if (team.id === teamId) {
        troopers.forEach(trooper => {
          team.troopers.push(trooper);
        })
      }
    });
  }

  removeTroopersFromTeam(troopers: any[], teamId: string) {
    console.log("remove troopers", troopers);
    this.battle.teams.map(team => {
      if (team.id === teamId) {
        console.log("team", team);
        troopers.forEach((trooper: any) => {
          const indexSupp = team.troopers.findIndex((trp) => trp.id === trooper.id);
          console.log("indexSupp", indexSupp);
          if (indexSupp >= 0) {
            team.troopers.splice(indexSupp, 1);
          }
        })
      }
    });
  }

}
