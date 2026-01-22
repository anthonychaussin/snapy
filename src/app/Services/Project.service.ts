import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Project} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class ProjectService extends FirebaseService implements IFirebaseService<Project> {

  constructor() {super(); }

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

  async GetAll(basePath: string, uuid: string[]): Promise<(Project | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

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
