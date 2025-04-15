import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDefaultGwComponent } from './update-default-gw.component';

describe('UpdateDefaultGwComponent', () => {
  let component: UpdateDefaultGwComponent;
  let fixture: ComponentFixture<UpdateDefaultGwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDefaultGwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDefaultGwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
