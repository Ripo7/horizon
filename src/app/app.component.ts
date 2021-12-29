import { Component, ChangeDetectorRef } from '@angular/core';
import { MoralisService } from './services/moralis.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hor1zon-civil-war';

  constructor(private moralisService: MoralisService, private cdr: ChangeDetectorRef) {
    this.moralisService.setChangeDetector(cdr);
  }

  
}
