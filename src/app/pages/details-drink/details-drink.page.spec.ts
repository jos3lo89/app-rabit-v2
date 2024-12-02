import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsDrinkPage } from './details-drink.page';

describe('DetailsDrinkPage', () => {
  let component: DetailsDrinkPage;
  let fixture: ComponentFixture<DetailsDrinkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsDrinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
