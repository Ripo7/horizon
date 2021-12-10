import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-home-eth',
  templateUrl: './home-eth.component.html',
  styleUrls: ['./home-eth.component.scss']
})
export class HomeEthComponent implements OnInit {

  mmOpenned: boolean = false;
  userAddress: any;

  mintNumber: number = 1;

  mintSuccess: boolean = false;

  constructor(private contractService: ContractService) { }

  ngOnInit(): void {
  }

  openMetamask() {
    this.contractService.openMetamask().then(data => {
      if (data) {
        this.mmOpenned = true;
        this.userAddress = data;
      }
    });
  }

  mint() {
    console.log("mint");
    this.contractService.sendPayment(this.userAddress, this.mintNumber).then(() => {
      this.mintSuccess = true;
    });
  }

  incrMintNumber() {
    this.mintNumber++
  }

  decrMintNumber() {
    if (this.mintNumber >= 1) {
      this.mintNumber--;
    }
  }

}
