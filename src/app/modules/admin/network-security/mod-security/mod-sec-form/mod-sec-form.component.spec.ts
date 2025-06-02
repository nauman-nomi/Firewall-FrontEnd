import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModSecFormComponent } from './mod-sec-form.component';

describe('ModSecFormComponent', () => {
  let component: ModSecFormComponent;
  let fixture: ComponentFixture<ModSecFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModSecFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModSecFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
