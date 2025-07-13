import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGeoBlockIpComponent } from './add-geoblock-ip.component';

describe('AddGeoblockIpComponent', () => {
  let component: AddGeoBlockIpComponent;
  let fixture: ComponentFixture<AddGeoBlockIpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGeoBlockIpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGeoBlockIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
