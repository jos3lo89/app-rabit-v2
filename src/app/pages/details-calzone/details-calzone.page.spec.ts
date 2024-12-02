import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsCalzonePage } from './details-calzone.page';

describe('DetailsCalzonePage', () => {
  let component: DetailsCalzonePage;
  let fixture: ComponentFixture<DetailsCalzonePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCalzonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
