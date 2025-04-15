import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateFwOptionComponent } from './dialog-update-fw-option.component';

describe('DialogUpdateFwOptionComponent', () => {
  let component: DialogUpdateFwOptionComponent;
  let fixture: ComponentFixture<DialogUpdateFwOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUpdateFwOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUpdateFwOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
