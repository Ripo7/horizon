import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTroopersComponent } from './my-troopers.component';

describe('MyTroopersComponent', () => {
  let component: MyTroopersComponent;
  let fixture: ComponentFixture<MyTroopersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTroopersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTroopersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
