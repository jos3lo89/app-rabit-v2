import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsRollsPage } from './details-rolls.page';

describe('DetailsRollsPage', () => {
  let component: DetailsRollsPage;
  let fixture: ComponentFixture<DetailsRollsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsRollsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
