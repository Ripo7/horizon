import { Injectable } from '@angular/core';
import Web3 from "web3";

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  window:any;
  constructor() { };

  private getAccounts = async () => {
      try {
          return await window.ethereum.request({ method: 'eth_accounts' });
      } catch (e) {
          return [];
      }
  }

  public openMetamask = async () => {
      window.web3 = new Web3(window.ethereum);
      let addresses = await this.getAccounts();
      console.log("service",addresses)
      if (!addresses.length) {
          try {
              addresses = await window.ethereum.enable();
          } catch (e) {
              return false;
          }
      }
      window.web3.eth.getBalance(addresses[0]).then((balance: any) => {
        console.log("balance", balance);
      });
      return addresses.length ? addresses[0] : null;
  };

}
