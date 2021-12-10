import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  constructor(private contractService: ContractService) { }

  ngOnInit(): void {
  }

  pay() {
  }

}
