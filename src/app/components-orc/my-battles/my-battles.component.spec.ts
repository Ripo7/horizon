import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBattlesComponent } from './my-battles.component';

describe('MyBattlesComponent', () => {
  let component: MyBattlesComponent;
  let fixture: ComponentFixture<MyBattlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyBattlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBattlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
