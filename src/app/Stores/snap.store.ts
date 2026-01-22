import {Injectable} from '@angular/core';
import {Snap} from '../Models';
import {SnapService} from '../Services/Snap.service';
import {BaseModelStore} from './base-model.store';

@Injectable({
              providedIn: 'root'
            })
export class SnapStore extends BaseModelStore<Snap> {
  constructor(snapService: SnapService) {
    super(snapService, Snap.DBName);
  }
}
