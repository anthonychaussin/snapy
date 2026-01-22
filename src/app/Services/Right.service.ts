import {Injectable} from '@angular/core';
import {Right} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class RightService extends FirebaseService implements IFirebaseService<Right> {

  constructor() {super(); }

  FirestoreName: string | undefined;
  RealTimeName: string | undefined;

  Delete(uuid: string[]): Promise<boolean> {
    return Promise.resolve(false);
  }

  Get(uuid: string): Promise<void | Right> {
    return Promise.resolve(undefined);
  }

  GetAll(uuid: string[]): Promise<(void | Right)[]> {
    return Promise.resolve([]);
  }

  Save(object: Right[]): Promise<Right[]> {
    return Promise.resolve([]);
  }

  Update(object: Right[]): Promise<boolean> {
    return Promise.resolve(false);
  }
}
