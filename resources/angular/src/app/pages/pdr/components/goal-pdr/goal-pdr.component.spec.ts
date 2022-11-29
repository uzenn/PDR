import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalPDRComponent } from './goal-pdr.component';

describe('GoalPDRComponent', () => {
  let component: GoalPDRComponent;
  let fixture: ComponentFixture<GoalPDRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalPDRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalPDRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
