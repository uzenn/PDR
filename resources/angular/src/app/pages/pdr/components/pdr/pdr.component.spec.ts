import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PDRComponent } from './pdr.component';

describe('PDRComponent', () => {
  let component: PDRComponent;
  let fixture: ComponentFixture<PDRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PDRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PDRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
