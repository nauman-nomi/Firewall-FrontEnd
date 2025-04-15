import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateMacrosComponent } from './dialog-update-macros.component';

describe('DialogUpdateMacrosComponent', () => {
  let component: DialogUpdateMacrosComponent;
  let fixture: ComponentFixture<DialogUpdateMacrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUpdateMacrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUpdateMacrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
