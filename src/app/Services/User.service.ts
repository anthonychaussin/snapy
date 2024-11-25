import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {User} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class UserService extends FirebaseService implements IFirebaseService<User> {

  constructor() {super(); }

  /**
   * Delete a Department
   * @return {boolean}
   * @constructor
   * @param users
   */
  async Delete(users: User[]): Promise<boolean> {
    try {
      await this.RealTimeDelete(users);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }

  async Get(basePath: string, uuid: string): Promise<User | void> {
    try {
      return await this.RealTimeGet<User>(User, basePath, uuid).catch((e) => {
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

  async GetAll(basePath: string, uuid: string[]): Promise<(User | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

  async Save(object: User[]): Promise<User[]> {
    try {
      return await this.RealTimeCreate<User>(object);
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return [];
    }
  }

  async Update(object: User[]): Promise<boolean> {
    try {
      await this.RealTimeUpdate<User>(object);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }
}
