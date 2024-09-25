import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Team} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class TeamService extends FirebaseService implements IFirebaseService<Team> {

  /**
   * Constructor
   */
  constructor() {super(); }

  /**
   * Delete all {@link Team}
   * @param {Team[]} teams array of {@link Team} to delete
   * @return {Promise<boolean>} true if succeed, else false
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

  /**
   * Get a {@link Team}
   * @param {string} basePath Base path of {@link Team} with his parents ids
   * @param {string} uuid Uuid of {@link Team} to fetch
   * @return {Promise<Team | void>} return {@link Team}, void if not found
   */
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

  /**
   * Get all {@link Team}
   * @param {string} basePath Base path of {@link Team} with parents ids
   * @param {string[]} uuid Array of {@link Team} Uuids to fetch
   * @return {Promise<(Team | void)[]>} return {@link Team}, void if not found
   */
  async GetAll(basePath: string, uuid: string[]): Promise<(Team | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

  /**
   * Create new {@link Team}
   * @param {Team[]} object Array {@link Team} to create
   * @return {Promise<Team[]>} return {@link Team} with there Uuid
   */
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

  /**
   * Update the {@link Team} (only new data are inserted)
   * @param {Team[]} object Array {@link Team} to update
   * @return {Promise<boolean>} true if {@link Team} are updated
   */
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
