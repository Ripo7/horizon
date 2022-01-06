import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MoralisService } from 'src/app/services/moralis.service';
import { Moralis } from 'moralis';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private localStorage: LocalStorageService, private moralisService: MoralisService) { }

  ngOnInit(): void {
  }

  getUserLogged() {
    return this.moralisService.getUserLogged();
  }

}
