/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WordsInBundleComponent } from './words-in-bundle.component';

describe('WordsInBundleComponent', () => {
  let component: WordsInBundleComponent;
  let fixture: ComponentFixture<WordsInBundleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordsInBundleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsInBundleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
