import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Task} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class TaskService extends FirebaseService implements IFirebaseService<Task> {

  constructor() {super(); }

  /**
   * Delete a Department
   * @return {boolean}
   * @constructor
   * @param tasks
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

  async GetAll(basePath: string, uuid: string[]): Promise<(Task | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

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
