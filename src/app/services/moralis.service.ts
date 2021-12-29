import { Injectable } from '@angular/core';
import { Moralis } from 'moralis';
import { environment } from 'src/environments/environment';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoralisService {

  user?: any;

  changeDetectorRef: any;

  constructor() { 
    Moralis.start({
      appId: environment.moralis.appId,
      serverUrl: environment.moralis.serverUrl,
    })
      .then(() => console.info('Moralis has been initialised.'))
      .finally(() => this.setLoggedInUser(Moralis.User.current()));
  }

  setChangeDetector(cdr: any) {
    this.changeDetectorRef = cdr;
  }

  loginWithMetamask() {
      Moralis.Web3.authenticate({ provider: 'metamask' })
          .then((loggedInUser) => {
            this.setLoggedInUser(loggedInUser);
            this.getUserNFTs();
          })
          .catch((e) => console.error(`Moralis metamask login error:`, e));
  }

  loginWalletConnect() {
    Moralis.Web3.authenticate({ provider: 'walletconnect' })
          .then((loggedInUser) => {
            this.setLoggedInUser(loggedInUser);
            this.getUserNFTs();
          })
          .catch((e) => console.error(`Moralis walletconnect login error:`, e));
  }

  logout() {
    Moralis.User.logOut()
      .then((loggedOutUser) => console.info('logout', loggedOutUser))
      // Set user to undefined
      .then(() => this.setLoggedInUser(undefined))
      // Disconnect Web3 wallet
      .then(() => Moralis.Web3.cleanup())
      .catch((e) => console.error('Moralis logout error:', e));
  }

  private setLoggedInUser(loggedInUser?: any) {
    this.user = loggedInUser;
    console.info('Loggedin user:', loggedInUser);
    /**
     * Manual detect changes due to OnPush change detection.
     * This can be eliminated if you use async pipe and Observables
     * (out of scope of this demo)
     */
    this.changeDetectorRef.detectChanges();
  }

  isUserLogged() {
    return this.user ? true : false;
  }

  getUserNFTs() {
    const options = { address: this.user.attributes[0], token_address: '0x36A52262a85Bf8FE213267DA4Ed85e42e1eFeD82' };
    Moralis.Web3API.account.getNFTsForContract(options).then(responseNFTs => {
      console.log("responseNFTs", responseNFTs);
      const options = { address: '0x36A52262a85Bf8FE213267DA4Ed85e42e1eFeD82', token_id: '280' };
      Moralis.Web3API.token.getTokenIdMetadata(options).then((resp) => {
        console.log("resp", resp);
      });
    });
  }
}