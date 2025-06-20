import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailGwFormComponent } from './email-gw-form.component';

describe('EmailGwFormComponent', () => {
  let component: EmailGwFormComponent;
  let fixture: ComponentFixture<EmailGwFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailGwFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailGwFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
