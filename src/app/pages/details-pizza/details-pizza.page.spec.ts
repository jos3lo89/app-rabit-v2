import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsPizzaPage } from './details-pizza.page';

describe('DetailsPizzaPage', () => {
  let component: DetailsPizzaPage;
  let fixture: ComponentFixture<DetailsPizzaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPizzaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
