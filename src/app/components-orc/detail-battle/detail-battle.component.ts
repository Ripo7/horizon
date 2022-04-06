import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Moralis } from 'moralis';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, tap } from 'rxjs/operators';
import { BattleService } from 'src/app/services/battle.service';
import { MoralisService } from 'src/app/services/moralis.service';

@Component({
  selector: 'app-detail-battle',
  templateUrl: './detail-battle.component.html',
  styleUrls: ['./detail-battle.component.scss']
})
export class DetailBattleComponent implements OnInit {

  @Input() selectedBattle: any;

  players: Array<any> = [];

  showAddPlayer = false;

  selectedCar: any;

  selectedOrc: any;

  indexToAdd = -1;

  playerToAdd: any;
  totalUserNft: Array<any> = [];
  nftOrcList: Array<any> = [];
  nftOrcCarList: Array<any> = [];
  loader = true;

  @Output() evtJoinReady = new EventEmitter<any>();

  constructor(private morService: MoralisService,
    private spinner: NgxSpinnerService,
    private db: AngularFirestore,
    private battleService: BattleService) { }

  ngOnInit(): void {
    console.log("selectedBattle", this.selectedBattle);
    this.players.push(this.selectedBattle.data.player1);
    this.players.push(this.selectedBattle.data.player2);
    this.players.push(this.selectedBattle.data.player3);
    this.players.push(this.selectedBattle.data.player4);
    this.players.push(this.selectedBattle.data.player5);
    this.spinner.show();
    Moralis.SolanaAPI.account.getNFTs({ network: "mainnet", address: Moralis.User.current()?.attributes.solAddress}).then(respBalance =>  {
      // console.log("respBalance", respBalance);
      this.totalUserNft = respBalance;
      let totalNft = respBalance.length;
      let nftDL = 0;
      
      respBalance.forEach((el: any) => {
          this.morService.getNftFromFirebase(el.mint).toPromise().then((respFire: any) => {
                if (respFire.length > 0) {
                   if (respFire[0].collection.name === 'O.R.C') {
                       this.nftOrcList.push(respFire[0]);
                       nftDL++;
                   } else if (respFire[0].collection.name === 'ORCars') {
                      this.nftOrcCarList.push(respFire[0])
                      nftDL++;
                    }
                } else {
                        Moralis.SolanaAPI.nft.getNFTMetadata({ network: "mainnet", address: el.mint}).then(respNFT => {
                        // console.log("respNFT", respNFT);
                        if (respNFT.symbol === 'orc') {
                          this.morService.getSolanaNFT(respNFT.metaplex.metadataUri)
                          .pipe(first(),
                          tap((respMetaplex: any) => {
                              this.morService.AddNftInFirebase({...respMetaplex, mintAddress: el.mint});
                            if (respMetaplex.collection.name === 'O.R.C') {
                              this.nftOrcList.push(respMetaplex);
                              nftDL++;
                            } else if (respMetaplex.collection.name === 'ORCars') {
                              this.nftOrcCarList.push(respMetaplex);
                              nftDL++;
                            }
                            if (totalNft === nftDL) {
                              this.loader = false;
                            }
                          }))
                          .subscribe()
                        } else {
                          totalNft--;
                          if (totalNft === nftDL) {
                            this.loader = false;
                          }
                        }
                      });
                }
                console.log("totalNFT", totalNft);
                console.log("nftDL", nftDL);
                if (totalNft === nftDL) {
                  this.loader = false;
                }
              })
      })
    })
  }

  selectOrc(orc: any) {
    console.log("orc", orc);
    this.selectedOrc = orc;
  }

  selectCar(car: any) {
    this.selectedCar = car;
  }

  addPlayer(index: number) {
    this.showAddPlayer = true; 
    this.indexToAdd = index;
  }

  carAlreadyUse(car: any) {
    let alreadyUsed = false;
    this.players.forEach(el => {
      if (el && el.car.mintAddress === car.mintAddress) {
        alreadyUsed = true;
      }
    });
    return alreadyUsed;
  }

  orcAlreadyUse(orc: any) {
    let alreadyUsed = false;
    this.players.forEach(el => {

      if (el && el.orc.mintAddress === orc.mintAddress) {
        alreadyUsed = true;
      }
    });
    return alreadyUsed;
  }

  isJoinReady() {
    return this.selectedCar && this.selectedOrc ? true : false;
  }

  joinBattle() {
    console.log("toooo");
    this.battleService.addPlayerToBattle(this.selectedBattle, this.selectedOrc, this.selectedCar, this.indexToAdd).then(() => {
      this.evtJoinReady.emit('');
    });
  }

  back() {
    this.evtJoinReady.emit('');
  }

  back1() {
    this.showAddPlayer = false;
    this.selectedCar = null;
    this.selectedOrc = null;
  }

}
