import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModSecDetailsComponent } from './view-mod-sec-details.component';

describe('ViewModSecDetailsComponent', () => {
  let component: ViewModSecDetailsComponent;
  let fixture: ComponentFixture<ViewModSecDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewModSecDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewModSecDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
