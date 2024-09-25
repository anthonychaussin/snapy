import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Snap} from '../Models/Snap';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class SnapService extends FirebaseService implements IFirebaseService<Snap> {

  /**
   * Constructor
   */
  constructor() {super(); }

  /**
   * Delete all {@link Snap}
   * @param {Snap[]} snaps Array of {@link Snap} to delete
   * @return {Promise<boolean>} true if succeed, else false
   */
  async Delete(snaps: Snap[]): Promise<boolean> {
    try {
      await this.FirestoreDelete(snaps);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }

  /**
   * Get a {@link Snap}
   * @param {string} basePath Base path of {@link Snap}
   * @param {string} uuid Uuid of {@link Snap} to fetch
   * @return {Promise<Snap | void>} return {@link Snap} object, void if not found
   */
  async Get(basePath: string, uuid: string): Promise<Snap | void> {
    try {
      return await this.FirestoreGet<Snap>(Snap, basePath, uuid).catch((e) => {
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
   * Get all {@link Snap}
   * @param {string} basePath Base path of {@link Snap}
   * @param {string[]} uuid Array of {@link Snap} Uuid to fetch
   * @return {Promise<(Snap | void)[]>} return {@link Snap} objects, void if not found
   */
  async GetAll(basePath: string, uuid: string[]): Promise<(Snap | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

  /**
   * Create new {@link Snap}
   * @param {Snap[]} object Array of {@link Snap} to create
   * @return {Promise<Snap[]>} return {@link Snap} with there Uuid
   */
  async Save(object: Snap[]): Promise<Snap[]> {
    try {
      return await this.RealTimeCreate<Snap>(object);
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return [];
    }
  }

  /**
   * Update the {@link Snap} (only new data are inserted)
   * @param {Snap[]} object Array {@link Snap} to update
   * @return {Promise<boolean>} true if {@link Snap} are updated
   */
  async Update(object: Snap[]): Promise<boolean> {
    try {
      await this.RealTimeUpdate<Snap>(object);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }
}
