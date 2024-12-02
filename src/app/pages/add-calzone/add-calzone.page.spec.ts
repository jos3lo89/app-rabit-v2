import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCalzonePage } from './add-calzone.page';

describe('AddCalzonePage', () => {
  let component: AddCalzonePage;
  let fixture: ComponentFixture<AddCalzonePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCalzonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
