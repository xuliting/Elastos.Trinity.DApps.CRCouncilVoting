import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesPage } from './candidates.page';

describe('CandidatesPage', () => {
  let component: CandidatesPage;
  let fixture: ComponentFixture<CandidatesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
