import { TestBed } from '@angular/core/testing';

import { DetallesMesaService } from './detalles-mesa.service';

describe('DetallesMesaService', () => {
  let service: DetallesMesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallesMesaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
