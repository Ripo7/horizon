import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOrcComponent } from './home-orc.component';

describe('HomeOrcComponent', () => {
  let component: HomeOrcComponent;
  let fixture: ComponentFixture<HomeOrcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeOrcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeOrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
