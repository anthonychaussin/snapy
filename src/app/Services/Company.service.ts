import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Company, Department} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class CompanyService extends FirebaseService implements IFirebaseService<Company> {

  constructor() {
    super();
  }

  /**
   * Delete a Department
   * @return {boolean}
   * @constructor
   * @param companies
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

  async GetAll(basePath: string, uuid: string[]): Promise<(Company | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

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
