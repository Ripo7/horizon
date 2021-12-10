import { Injectable } from '@angular/core';
import Web3 from "web3";

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  window:any;

  web3: any;

  addresses: any;
  constructor() { };

  private getAccounts = async () => {
      try {
          return await window.ethereum.request({ method: 'eth_accounts' });
      } catch (e) {
          return [];
      }
  }

  public openMetamask = async () => {
      let addresses = await this.getAccounts();
      console.log("service",addresses)
      if (!addresses.length) {
          try {
              addresses = await window.ethereum.enable();
          } catch (e) {
              return false;
          }
      }
      this.web3 = new Web3(window.ethereum);
      this.addresses = addresses;
      return addresses.length ? addresses[0] : null;
  };

  public sendPayment = async (userAddress: any, mintNumber: number) => {
    console.log("this.web3",this.web3);
    let amout = 0.1 *  mintNumber
    console.log("amount", String(amout));
    this.web3.eth.sendTransaction({from: userAddress, to: '0x1E673E737bae0547793C77501803a62Dfa45D126',
        value: this.web3.utils.toWei(String(amout), 'ether')
      })
      .once('sending')
      .once('sent', console.log("sent"))
      .once('transactionHash', console.log("transactionHash"))
      .once('receipt', console.log("receipt"))
      .on('confirmation', console.log("confirmation"))
      .on('error', console.log("error"))
      .then(function(receipt: any){
        console.log("receipt final", receipt);
      });
  }

}
