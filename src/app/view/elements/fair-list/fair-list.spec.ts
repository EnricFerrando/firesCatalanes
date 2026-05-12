import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FairList } from './fair-list';

describe('FairList', () => {
  let component: FairList;
  let fixture: ComponentFixture<FairList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FairList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FairList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
