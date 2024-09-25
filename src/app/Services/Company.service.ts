import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Company} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })

/**
 * Company Service
 * Manage {@link Company}
 */
export class CompanyService extends FirebaseService implements IFirebaseService<Company> {

  constructor() {
    super();
  }

  /**
   * Delete {@link Company}
   * @param companies Array of {@link Company} to delete
   * @return {boolean} true if succeed, else false
   */
  async Delete(companies: Company[]): Promise<boolean> {
    try {
      await this.RealTimeDelete(companies);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }

  /**
   * Get a {@link Company}
   * @param {string} basePath Base path of {@link Company}
   * @param {string} uuid Uuid of {@link Company} to fetch
   * @return {Promise<Company | void>} return {@link Company}, void if not found
   */
  async Get(basePath: string, uuid: string): Promise<Company | void> {
    try {
      return await this.RealTimeGet<Company>(Company, basePath, uuid).catch((e) => {
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
   * Get all {@link Company}
   * @param {string} basePath Base path of {@link Company}
   * @param {string[]} uuid Array of {@link Company} Uuids to fetch
   * @return {Promise<(Company | void)[]>} return array of existing {@link Company}, void if not found
   */
  async GetAll(basePath: string, uuid: string[]): Promise<(Company | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

  /**
   * Create new {@link Company}
   * @param {Company[]} object Array of {@link Company} to create
   * @return {Promise<Company[]>} return array of {@link Company} with there Uuid
   */
  async Save(object: Company[]): Promise<Company[]> {
    try {
      return await this.RealTimeCreate<Company>(object);
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return [];
    }
  }

  /**
   * Update the {@link Company} (only new data are inserted)
   * @param {Company[]} object Array of {@link Company} to update
   * @return {Promise<boolean>} true if {@link Company} are updated
   */
  async Update(object: Company[]): Promise<boolean> {
    try {
      await this.RealTimeUpdate<Company>(object);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }
}
