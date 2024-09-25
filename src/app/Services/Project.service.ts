import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Project} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })

/**
 * Project Service
 * Manage {@link Project} of a {@link Department}
 */
export class ProjectService extends FirebaseService implements IFirebaseService<Project> {

  /**
   * Constructor
   */
  constructor() {super(); }

  /**
   * Delete a {@link Project}
   * @param {Project[]} projects Array of {@link Project} to delete
   * @return {Promise<boolean>} true if succeed, else false
   */
  async Delete(projects: Project[]): Promise<boolean> {
    try {
      await this.RealTimeDelete(projects);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }

  /**
   * Get a {@link Project}
   * @param {string} basePath Base path of {@link Project}, including parents ids
   * @param {string} uuid Uuid of {@link Project} to fetch
   * @return {Promise<Project | void>} Existing {@link Project} or null if not founded
   */
  async Get(basePath: string, uuid: string): Promise<Project | void> {
    try {
      return await this.RealTimeGet<Project>(Project, basePath, uuid).catch((e) => {
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
   * Get all {@link Project}
   * @param {string} basePath Base path of {@link Project}, including parents ids
   * @param {string[]} uuid Array of {@link Project} Uuids
   * @return {Promise<(Project | void)[]>} return array of existing {@link Project}
   */
  async GetAll(basePath: string, uuid: string[]): Promise<(Project | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

  /**
   * Create a new {@link Project}
   * @param {Project[]} object Array of {@link Project} to create
   * @return {Promise<Project[]>} the {@link Project} with there Uuids
   */
  async Save(object: Project[]): Promise<Project[]> {
    try {
      return await this.RealTimeCreate<Project>(object);
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return [];
    }
  }

  /**
   * Update the {@link Project} (only new data are inserted)
   * @param {Project[]} object Array of {@link Project} to update
   * @return {Promise<boolean>} true if {@link Project} are updated
   */
  async Update(object: Project[]): Promise<boolean> {
    try {
      await this.RealTimeUpdate<Project>(object);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }
}
