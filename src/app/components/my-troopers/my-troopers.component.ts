import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BattleService } from 'src/app/services/battle.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MoralisService } from 'src/app/services/moralis.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-my-troopers',
  templateUrl: './my-troopers.component.html',
  styleUrls: ['./my-troopers.component.scss']
})
export class MyTroopersComponent implements OnInit {

  connectedUser :any;
  showTrooper: boolean = false;
  doEditTroopName: boolean = false;
  trooperToShow: any = null;

  loader = true;

  newTrooperName: string = '';

  userNFTs : any[] = [];

  constructor(private usersService: UsersService, 
    private localStorage: LocalStorageService, 
    private moralisService: MoralisService,
    private spinner: NgxSpinnerService,
    private battleService: BattleService) { }

  ngOnInit(): void {
    this.spinner.show();
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
          this.userNFTs.push(tmpData);
          count ++;
          if (count === nftObs.length) {
            this.loader = false;
          }
        })
      })
    });
  }

  showTrooperDetails(trooper: any) {
    this.showTrooper = true;
    this.trooperToShow = trooper;
  }

  backShowTrooper() {
    this.showTrooper = false;
    this.trooperToShow = null;
    this.doEditTroopName = false;
  }

}
