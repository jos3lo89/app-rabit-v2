import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListDrinksPage } from './list-drinks.page';

describe('ListDrinksPage', () => {
  let component: ListDrinksPage;
  let fixture: ComponentFixture<ListDrinksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDrinksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
