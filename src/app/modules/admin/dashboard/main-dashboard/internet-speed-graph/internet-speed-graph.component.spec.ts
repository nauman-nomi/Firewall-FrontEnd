import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetSpeedGraphComponent } from './internet-speed-graph.component';

describe('InternetSpeedGraphComponent', () => {
  let component: InternetSpeedGraphComponent;
  let fixture: ComponentFixture<InternetSpeedGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternetSpeedGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetSpeedGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
