import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEthComponent } from './home-eth.component';

describe('HomeEthComponent', () => {
  let component: HomeEthComponent;
  let fixture: ComponentFixture<HomeEthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeEthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
