import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPizzasPage } from './list-pizzas.page';

describe('ListPizzasPage', () => {
  let component: ListPizzasPage;
  let fixture: ComponentFixture<ListPizzasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPizzasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
