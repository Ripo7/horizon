import { Injectable } from '@angular/core';

import { Connection, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';

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
      console.log("this.web3", this.web3);
      const minABI = [
        // balanceOf
        {
          "constant": true,
          "inputs": [{"name":"_owner","type":"address"}],
          "name": "balanceOf",
          "outputs": [{"name":"balance","type":"uint256"}],
          "type": "function"
        }
      ];
      const contract = new this.web3.eth.Contract(minABI, '0x36A52262a85Bf8FE213267DA4Ed85e42e1eFeD82');
      const result = await contract.methods.balanceOf('0x1E673E737bae0547793C77501803a62Dfa45D126').call(); 
      const format = this.web3.utils.fromWei(result); // 29803630.997051883414242659
      console.log("result", result);
      return addresses.length ? addresses[0] : null;
  };

  public sendPayment = async (userAddress: any, mintNumber: number) => {
    console.log("this.web3",this.web3);
    let amout = 0.1 *  mintNumber
    console.log("amount", String(amout));
    this.web3.eth.sendTransaction({from: userAddress, to: '0xc2F7e0d0d3854a0f8d5db255b5EF25b8DC5A03BA',
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
