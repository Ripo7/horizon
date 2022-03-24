import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderOrcComponent } from './header-orc.component';

describe('HeaderOrcComponent', () => {
  let component: HeaderOrcComponent;
  let fixture: ComponentFixture<HeaderOrcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderOrcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderOrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
