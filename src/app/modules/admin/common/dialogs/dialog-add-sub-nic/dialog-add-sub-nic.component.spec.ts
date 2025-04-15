import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddSubNicComponent } from './dialog-add-sub-nic.component';

describe('DialogAddSubNicComponent', () => {
  let component: DialogAddSubNicComponent;
  let fixture: ComponentFixture<DialogAddSubNicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddSubNicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddSubNicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
