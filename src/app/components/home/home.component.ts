import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sideToSee: string = 'red';

  constructor() { }

  ngOnInit(): void {
  }

  seeSide(side: string) {
    this.sideToSee = side;
  }

}
