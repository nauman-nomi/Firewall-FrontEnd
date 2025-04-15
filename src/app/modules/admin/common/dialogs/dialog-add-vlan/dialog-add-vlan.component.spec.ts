import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddVlanComponent } from './dialog-add-vlan.component';

describe('DialogAddVlanComponent', () => {
  let component: DialogAddVlanComponent;
  let fixture: ComponentFixture<DialogAddVlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddVlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddVlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
