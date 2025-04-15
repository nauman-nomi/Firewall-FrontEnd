import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddRouteComponent } from './dialog-add-route.component';

describe('DialogAddRouteComponent', () => {
  let component: DialogAddRouteComponent;
  let fixture: ComponentFixture<DialogAddRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
