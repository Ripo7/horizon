import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private connectedUser = {
    id: "0",
    name: "Ripo",
    troopers: [
      {
        id: "280",
        name: "Azork",
        image: "assets/images/trooper-1.png",
        rarity: 1227,
        status: 'ready',
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
        id: "1209",
        name: "Alexis",
        image: "assets/images/trooper-2.png",
        rarity: 354,
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

  constructor() { }

  getConnectedUser() {
    return this.connectedUser;
  }

  setTrooperName(trooperId: string, newName: string) {
    this.connectedUser.troopers.map(trooper => {
      if (trooper.id === trooperId) {
        trooper.name = newName;
      }
    })
  }
}
