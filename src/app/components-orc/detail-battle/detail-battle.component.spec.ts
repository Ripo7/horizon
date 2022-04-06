import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBattleComponent } from './detail-battle.component';

describe('DetailBattleComponent', () => {
  let component: DetailBattleComponent;
  let fixture: ComponentFixture<DetailBattleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailBattleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
