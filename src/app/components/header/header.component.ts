import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private localStorage: LocalStorageService) { }

  isUserLogged: boolean = false;

  ngOnInit(): void {
    this.isUserLogged = this.localStorage.isUserLog();
  }

}
