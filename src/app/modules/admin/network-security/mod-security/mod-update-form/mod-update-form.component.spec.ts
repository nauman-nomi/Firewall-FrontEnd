import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModUpdateFormComponent } from './mod-update-form.component';

describe('ModUpdateFormComponent', () => {
  let component: ModUpdateFormComponent;
  let fixture: ComponentFixture<ModUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModUpdateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
