import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWhitelistIpComponent } from './add-whitelist-ip.component';

describe('AddWhitelistIpComponent', () => {
  let component: AddWhitelistIpComponent;
  let fixture: ComponentFixture<AddWhitelistIpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWhitelistIpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWhitelistIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
