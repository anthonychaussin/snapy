import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Task} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class TaskService extends FirebaseService implements IFirebaseService<Task> {

  /**
   * Constructor
   */
  constructor() {super(); }

  /**
   * Delete all {@link Task}
   * @param {Task[]} tasks Array of {@link Task} to delete
   * @return {Promise<boolean>} true if succeed, else false
   */
  async Delete(tasks: Task[]): Promise<boolean> {
    try {
      await this.RealTimeDelete(tasks);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }

  /**
   * Get a {@link Task}
   * @param {string} basePath Base path of {@link Task} with his parents ids
   * @param {string} uuid Uuid of {@link Task} to fetch
   * @return {Promise<Task | void>} return {@link Task}, void if not found
   */
  async Get(basePath: string, uuid: string): Promise<Task | void> {
    try {
      return await this.RealTimeGet<Task>(Task, basePath, uuid).catch((e) => {
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
   * Get all {@link Task}
   * @param {string} basePath Base path of {@link Task} with parents ids
   * @param {string[]} uuid Array of {@link Task} Uuid to fetch
   * @return {Promise<(Task | void)[]>} return {@link Task}, void if not found
   */
  async GetAll(basePath: string, uuid: string[]): Promise<(Task | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

  /**
   * Create new {@link Task}
   * @param {Task[]} object Array of {@link Task} to create
   * @return {Promise<Task[]>} return {@link Task} with there Uuid
   */
  async Save(object: Task[]): Promise<Task[]> {
    try {
      return await this.RealTimeCreate<Task>(object);
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return [];
    }
  }

  /**
   * Update the {@link Task} (only new data are inserted)
   * @param {Task[]} object Array {@link Task} to update
   * @return {Promise<boolean>} true if {@link Task} are updated
   */
  async Update(object: Task[]): Promise<boolean> {
    try {
      await this.RealTimeUpdate<Task>(object);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }
}
