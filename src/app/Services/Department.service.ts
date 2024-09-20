import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Department} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class DepartmentService extends FirebaseService implements IFirebaseService<Department> {

  constructor() {super(); }

  /**
   * Delete a Department
   * @return {boolean}
   * @constructor
   * @param departments
   */
  async Delete(departments: Department[]): Promise<boolean> {
    try {
      await this.RealTimeDelete(departments);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }

  async Get(basePath: string, uuid: string): Promise<Department | void> {
    try {
      return await this.RealTimeGet<Department>(Department, basePath, uuid).catch((e) => {
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

  async GetAll(basePath: string, uuid: string[]): Promise<(Department | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

  async Save(object: Department[]): Promise<Department[]> {
    try {
      return await this.RealTimeCreate<Department>(object);
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return [];
    }
  }

  async Update(object: Department[]): Promise<boolean> {
    try {
      await this.RealTimeUpdate<Department>(object);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }
}
