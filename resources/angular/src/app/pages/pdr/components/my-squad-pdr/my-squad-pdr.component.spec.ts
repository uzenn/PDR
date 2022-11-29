import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySquadPDRComponent } from './my-squad-pdr.component';

describe('MySquadPDRComponent', () => {
  let component: MySquadPDRComponent;
  let fixture: ComponentFixture<MySquadPDRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySquadPDRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySquadPDRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
