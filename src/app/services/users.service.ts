import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  backUrl = 'http://13.38.51.28:3000';

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

  options: any;

  

  constructor(private httpService: HttpClient, 
              private localStorage: LocalStorageService,
              private router: Router) {

    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    console.log("headers", headers);
    this.options = {
      headers: headers
    }
  }

  getConnectedUser() {
    return this.connectedUser;
  }

  signup(user: any) {
    return this.httpService.post(`${this.backUrl}/users/create`, user, this.options);
  }

  getUserInfo(userId: string) {

    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${JSON.parse(JSON.stringify(this.localStorage.get('token')))}`
    });
    console.log("userId", userId);
    this.options = {
      headers: headers
    }
    return this.httpService.get(`${this.backUrl}/users/${userId}`, this.options);
  }

  login(user: any) {
    return this.httpService.post(`${this.backUrl}/users/login`, user, this.options).subscribe((res: any) => {
      console.log("res", res);
      this.localStorage.set('token', res.token);
      this.localStorage.set('userId', res.userId);
      this.router.navigate(['home']);
    });
  }

  logout() {
    this.localStorage.remove('token');
    this.localStorage.remove('userId')
  }




  setTrooperName(trooperId: string, newName: string) {
    this.connectedUser.troopers.map(trooper => {
      if (trooper.id === trooperId) {
        trooper.name = newName;
      }
    })
  }
}
