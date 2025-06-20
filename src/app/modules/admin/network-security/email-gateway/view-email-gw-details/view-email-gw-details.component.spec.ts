import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmailGwDetailsComponent } from './view-email-gw-details.component';

describe('ViewEmailGwDetailsComponent', () => {
  let component: ViewEmailGwDetailsComponent;
  let fixture: ComponentFixture<ViewEmailGwDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEmailGwDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmailGwDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
