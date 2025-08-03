import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIdsPortComponent } from './add-ids-port.component';

describe('AddIdsPortComponent', () => {
  let component: AddIdsPortComponent;
  let fixture: ComponentFixture<AddIdsPortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIdsPortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIdsPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
