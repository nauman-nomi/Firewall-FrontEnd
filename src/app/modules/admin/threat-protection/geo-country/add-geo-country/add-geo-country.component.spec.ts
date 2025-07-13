import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGeoCountryComponent } from './add-geo-country.component';

describe('AddGeoCountryComponent', () => {
  let component: AddGeoCountryComponent;
  let fixture: ComponentFixture<AddGeoCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGeoCountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGeoCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
