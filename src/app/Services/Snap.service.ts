import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Snap} from '../Models/Snap';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class SnapService extends FirebaseService implements IFirebaseService<Snap> {

  constructor() {super(); }

  /**
   * Delete a Department
   * @return {boolean}
   * @constructor
   * @param departments
   */
  async Delete(snaps: Snap[]): Promise<boolean> {
    try {
      await this.FirestoreDelete(snaps);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }

  async Get(basePath: string, uuid: string): Promise<Snap | void> {
    try {
      return await this.FirestoreGet<Snap>(Snap, basePath, uuid).catch((e) => {
        if (environment.ENV === 'development') {
          console.error(e);
        }
      });
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return Promise.resolve();
    }
  }

  async GetAll(basePath: string, uuid: string[]): Promise<(Snap | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

  async Save(object: Snap[]): Promise<Snap[]> {
    try {
      return await this.RealTimeCreate<Snap>(object);
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return [];
    }
  }

  async Update(object: Snap[]): Promise<boolean> {
    try {
      await this.RealTimeUpdate<Snap>(object);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }
}
