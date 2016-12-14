/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WordPacksComponent } from './word-packs.component';

describe('WordPacksComponent', () => {
  let component: WordPacksComponent;
  let fixture: ComponentFixture<WordPacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordPacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
