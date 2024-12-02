import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCalzonePage } from './list-calzone.page';

describe('ListCalzonePage', () => {
  let component: ListCalzonePage;
  let fixture: ComponentFixture<ListCalzonePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCalzonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
