import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddRollsPage } from './add-rolls.page';

describe('AddRollsPage', () => {
  let component: AddRollsPage;
  let fixture: ComponentFixture<AddRollsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRollsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
