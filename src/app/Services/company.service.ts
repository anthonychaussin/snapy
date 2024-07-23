import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Company} from '../Models';
import {BaseService} from './base.service';
import {IBaseService} from './ibase.service';

@Injectable({
              providedIn: 'root'
            })
export class CompanyService extends BaseService implements IBaseService<Company> {

  constructor() {
    super();
  }

  FirestoreName: string | undefined;
  RealTimeName: string = 'Company';

  /**
   * Delete a Company
   * @param {string[]} uuid Unique identifier of company to delete
   * @return {boolean}
   * @constructor
   */
  async Delete(uuid: string[]): Promise<boolean> {
    try {
      await this.RealTimeDelete(this.RealTimeName, uuid);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }

  Get(uuid: string): Company {
    return undefined;
  }

  GetAll(uuid: string[]): Company[] {
    return [];
  }

  Save(object: Company[]): boolean {
    return false;
  }

  Update(object: Company): Company {
    return undefined;
  }
}
