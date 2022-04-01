import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Moralis } from 'moralis';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, tap } from 'rxjs/operators';
import { MoralisService } from 'src/app/services/moralis.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  loader = true;

  nftToShow: any = null;

  totalUserNft: Array<any> = [];

  nftOrcList: Array<any> = [];

  nftOrcCarList: Array<any> = [];

  private dbPath = '/nfts';

  nftRef: AngularFirestoreCollection<any>;

  constructor(private morService: MoralisService,
    private spinner: NgxSpinnerService,
    private db: AngularFirestore) { 
      this.nftRef = this.db.collection(this.dbPath);
    }

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

  goTo(url: string) {
    window.location.href = url;
  }

  showNft(nft: any) {
    console.log("nft", nft);
    this.nftToShow = nft;
  }

  back() {
    this.nftToShow = null;
  }
  
}
