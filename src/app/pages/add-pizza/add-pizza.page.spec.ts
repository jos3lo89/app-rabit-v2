import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPizzaPage } from './add-pizza.page';

describe('AddPizzaPage', () => {
  let component: AddPizzaPage;
  let fixture: ComponentFixture<AddPizzaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPizzaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
