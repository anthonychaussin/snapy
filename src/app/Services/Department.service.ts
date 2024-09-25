import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Department} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
/**
 * Department Service
 * Manage {@link Department} of a {@link Company}
 */
export class DepartmentService extends FirebaseService implements IFirebaseService<Department> {

  constructor() {super(); }

  /**
   * Delete {@link Department}
   * @param departments Array of {@link Department} to delete
   * @return {boolean} true if succeed, else false
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

  /**
   * Get a {@link Department}
   * @param {string} basePath Base path of {@link Department}, including parents ids
   * @param {string} uuid Uuid of {@link Department} to fetch
   * @return {Promise<Department | void>} return {@link Department} or void if not found
   */
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

  /**
   * Get all {@link Department}
   * @param {string} basePath Base path of {@link Department}, including parents ids
   * @param {string[]} uuid Array of {@link Department} Uuids to fetch
   * @return {Promise<(Department | void)[]>} return array of existing {@link Department}
   */
  async GetAll(basePath: string, uuid: string[]): Promise<(Department | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

  /**
   * Create a new {@link Department}
   * @param {Department[]} object Array of {@link Department} to create
   * @return {Promise<Department[]>} return array of {@link Department} with there Uuids
   */
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

  /**
   * Update the {@link Department} (only new data are inserted)
   * @param {Department[]} object Array of {@link Department} to update
   * @return {Promise<boolean>} true if {@link Department} are updated
   * @constructor
   */
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
