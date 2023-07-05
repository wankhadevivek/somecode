import { TestBed } from '@angular/core/testing';

import { DilogOpenService } from './dilog-open.service';

describe('DilogOpenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DilogOpenService = TestBed.get(DilogOpenService);
    expect(service).toBeTruthy();
  });
});
