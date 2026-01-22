import {Injectable} from '@angular/core';
import {Right} from '../Models';
import {RightService} from '../Services/Right.service';
import {BaseModelStore} from './base-model.store';

@Injectable({
              providedIn: 'root'
            })
export class RightStore extends BaseModelStore<Right> {
  constructor(rightService: RightService) {
    super(rightService, Right.DBName);
  }
}
