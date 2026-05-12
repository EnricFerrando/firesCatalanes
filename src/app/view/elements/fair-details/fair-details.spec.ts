import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FairDetails } from './fair-details';

describe('FairDetails', () => {
  let component: FairDetails;
  let fixture: ComponentFixture<FairDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FairDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FairDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
