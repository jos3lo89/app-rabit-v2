import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListExtrasPage } from './list-extras.page';

describe('ListExtrasPage', () => {
  let component: ListExtrasPage;
  let fixture: ComponentFixture<ListExtrasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExtrasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
