import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIdsNetworkComponent } from './add-ids-network.component';

describe('AddIdsNetworkComponent', () => {
  let component: AddIdsNetworkComponent;
  let fixture: ComponentFixture<AddIdsNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIdsNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIdsNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
