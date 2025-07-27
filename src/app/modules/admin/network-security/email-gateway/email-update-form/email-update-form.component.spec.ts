import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailUpdateFormComponent } from './email-update-form.component';

describe('EmailUpdateFormComponent', () => {
  let component: EmailUpdateFormComponent;
  let fixture: ComponentFixture<EmailUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailUpdateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
