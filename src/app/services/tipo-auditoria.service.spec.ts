import { TestBed } from '@angular/core/testing';

import { TipoAuditoriaService } from './tipo-auditoria.service';

describe('TipoAuditoriaService', () => {
  let service: TipoAuditoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoAuditoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
