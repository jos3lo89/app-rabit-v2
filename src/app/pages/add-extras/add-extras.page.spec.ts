import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddExtrasPage } from './add-extras.page';

describe('AddExtrasPage', () => {
  let component: AddExtrasPage;
  let fixture: ComponentFixture<AddExtrasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExtrasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
