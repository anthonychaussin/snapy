import {TestBed} from '@angular/core/testing';

import {IBaseService} from './ibase.service';

describe('IBaseService', () => {
  let service: IBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
