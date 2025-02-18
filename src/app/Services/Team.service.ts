import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Team} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class TeamService extends FirebaseService implements IFirebaseService<Team> {

  constructor() {super(); }

  /**
   * Delete a Department
   * @return {boolean}
   * @constructor
   * @param teams
   */
  async Delete(teams: Team[]): Promise<boolean> {
    try {
      await this.RealTimeDelete(teams);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }

  async Get(basePath: string, uuid: string): Promise<Team | void> {
    try {
      return await this.RealTimeGet<Team>(Team, basePath, uuid).catch((e) => {
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

  async GetAll(basePath: string, uuid: string[]): Promise<(Team | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

  async Save(object: Team[]): Promise<Team[]> {
    try {
      return await this.RealTimeCreate<Team>(object);
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return [];
    }
  }

  async Update(object: Team[]): Promise<boolean> {
    try {
      await this.RealTimeUpdate<Team>(object);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }
}
