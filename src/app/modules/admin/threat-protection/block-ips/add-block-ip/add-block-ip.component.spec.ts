import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlockIpComponent } from './add-block-ip.component';

describe('AddBlockIpComponent', () => {
  let component: AddBlockIpComponent;
  let fixture: ComponentFixture<AddBlockIpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBlockIpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBlockIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
