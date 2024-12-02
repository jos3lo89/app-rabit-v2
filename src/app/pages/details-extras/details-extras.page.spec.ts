import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsExtrasPage } from './details-extras.page';

describe('DetailsExtrasPage', () => {
  let component: DetailsExtrasPage;
  let fixture: ComponentFixture<DetailsExtrasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsExtrasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
