import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotePage } from './vote.page';

describe('VotePage', () => {
  let component: VotePage;
  let fixture: ComponentFixture<VotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
