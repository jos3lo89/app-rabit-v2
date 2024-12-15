import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsMesaPage } from './details-mesa.page';

describe('DetailsMesaPage', () => {
  let component: DetailsMesaPage;
  let fixture: ComponentFixture<DetailsMesaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
