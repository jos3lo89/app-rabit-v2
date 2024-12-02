import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListRollsPage } from './list-rolls.page';

describe('ListRollsPage', () => {
  let component: ListRollsPage;
  let fixture: ComponentFixture<ListRollsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRollsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
