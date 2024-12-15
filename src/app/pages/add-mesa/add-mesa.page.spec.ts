import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMesaPage } from './add-mesa.page';

describe('AddMesaPage', () => {
  let component: AddMesaPage;
  let fixture: ComponentFixture<AddMesaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
