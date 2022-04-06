import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Moralis } from 'moralis';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, tap } from 'rxjs/operators';
import { BattleService } from 'src/app/services/battle.service';
import { MoralisService } from 'src/app/services/moralis.service';

@Component({
  selector: 'app-create-battle',
  templateUrl: './create-battle.component.html',
  styleUrls: ['./create-battle.component.scss']
})
export class CreateBattleComponent implements OnInit {
  totalUserNft: Array<any> = [];

  nftOrcList: Array<any> = [];

  nftOrcCarList: Array<any> = [];

  selectedOrc: any;

  selectedCar: any;

  loader = true;

  battleNameText: string = '';

  @Output() evtBattleReady = new EventEmitter<any>();

  constructor(private morService: MoralisService,
    private spinner: NgxSpinnerService,
    private db: AngularFirestore,
    private battleService: BattleService) { }

  ngOnInit(): void {
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

  isBattleReady() {
    return this.battleNameText != '' && this.selectedCar && this.selectedOrc ? true : false;
  }

  selectCar(car: any) {
    this.selectedCar = car;
  }

  createBattle() {
    if (this.isBattleReady()) {
      return this.battleService.createBattleOrc(this.battleNameText, this.selectedOrc, this.selectedCar).then(() => {
        this.evtBattleReady.emit('');
      });
    } else {
      return null;
    }
  }

  back() {
    this.evtBattleReady.emit('');
  }
}
