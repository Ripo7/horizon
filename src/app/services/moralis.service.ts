import { Injectable } from '@angular/core';
import { Moralis } from 'moralis';
import { environment } from 'src/environments/environment';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MoralisService {

  changeDetectorRef: any;

  constructor(private httpService: HttpClient, private router: Router) { 
    Moralis.start({
      appId: environment.moralis.appId,
      serverUrl: environment.moralis.serverUrl,
    })
      .then(() => console.info('Moralis has been initialised.'))
      .finally(() => {
        console.log("Moralis.User.current()?.attributes.accounts;", Moralis.User.current()?.attributes.accounts);
      });
  }

  setChangeDetector(cdr: any) {
    this.changeDetectorRef = cdr;
  }

  async loginWithMetamask() {
      Moralis.Web3.authenticate({ provider: 'metamask', signingMessage: 'Connect to Hor1zon Civil War' })
          .then((loggedInUser) => {
            console.log("loggedInUser", loggedInUser);
          })
          .catch((e) => console.error(`Moralis metamask login error:`, e));
  }

  // loginWalletConnect() {
  //   Moralis.Web3.authenticate({ provider: 'walletconnect', signingMessage: 'Connect to Galleria' })
  //         .then((loggedInUser) => {
  //           console.log("loggedInUser wallet connect", loggedInUser)
  //           Moralis.Web3.link(loggedInUser.attributes.accounts[0]);
  //           this.setLoggedInUser(loggedInUser);
  //           this.getUserNFTs();
  //         })
  //         .catch((e) => console.error(`Moralis walletconnect login error:`, e));
  // }

  // async loginSolana() {
  //   Moralis.Web3.authenticate({type:'sol'}).then(function(user) {
  //     console.log(user.get('solAddress'))
  //     console.log("moralis current suer sol", Moralis.User.current());
  //   })
  // }

  logout() {
    Moralis.User.logOut()
      .then((loggedOutUser) => console.info('logout', loggedOutUser))
      // Disconnect Web3 wallet
      .then(() => {
        Moralis.Web3.cleanup()
        this.router.navigate(['home']);
      })
      .catch((e) => console.error('Moralis logout error:', e));
  }

   async getUserNFTs() {
    const options = { address: Moralis.User.current()?.attributes.accounts[0], token_address: '0x36A52262a85Bf8FE213267DA4Ed85e42e1eFeD82' };
    const currentUserNft = await Moralis.Web3API.account.getNFTsForContract(options);
    return currentUserNft.result?.map(async currNFT => {
      const data = await this.getOpenSeaMetadata(currNFT.token_id);
      return data;
    })
    // this.httpService.get(`https://api.opensea.io/api/v1/asset/0x36A52262a85Bf8FE213267DA4Ed85e42e1eFeD82/${responseNFTs.result[0].token_id}/`)    
  }

  getUserLogged() {
    return Moralis.User.current();
  }

  getOpenSeaMetadata(idToken: any) {
    return this.httpService.get(`https://api.opensea.io/api/v1/asset/0x36A52262a85Bf8FE213267DA4Ed85e42e1eFeD82/${idToken}/`).toPromise();  
  }
}