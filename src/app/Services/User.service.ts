import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {User} from '../Models';
import {FirebaseService} from './Firebase.service';
import {IFirebaseService} from './IFirebase.service';

@Injectable({
              providedIn: 'root'
            })
export class UserService extends FirebaseService implements IFirebaseService<User> {

  /**
   * Constructor
   */
  constructor() {super(); }

  /**
   * Delete {@link User}
   * @param {User[]} users Array of {@link User} to delete
   * @return {Promise<boolean>} true if succeed, else false
   */
  async Delete(users: User[]): Promise<boolean> {
    try {
      await this.RealTimeDelete(users);
      await this.FirestoreDelete(users);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }

  /**
   * Get a {@link User}
   * @param {string} basePath Base path of {@link User}
   * @param {string} uuid Uuid of {@link User} to fetch
   * @return {Promise<User | void>} return {@link User} or void if not found
   */
  async Get(basePath: string, uuid: string): Promise<User | void> {
    try {
      return await this.RealTimeGet<User>(User, basePath, uuid).catch((e) => {
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
   * Get all {@link User}
   * @param {string} basePath Base path of {@link User}
   * @param {string[]} uuid Array of {@link User} Uuid
   * @return {Promise<(User | void)[]>} return array of existing {@link User}
   */
  async GetAll(basePath: string, uuid: string[]): Promise<(User | void)[]> {
    return Promise.all(uuid.map(u => this.Get(basePath, u)));
  }

  /**
   * Create a new {@link User}
   * @param {User[]} object Array of {@link User} to create
   * @return {Promise<User[]>} Array of {@link User}
   */
  async Save(object: User[]): Promise<User[]> {
    try {
      return await this.RealTimeCreate<User>(object); //TODO il faut faire un meilleur system, techniquement on ne créé pas de user, on leur envoie simplement un mail pour les inviter à se créé un compte
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return [];
    }
  }

  /**
   * Update the {@link User} (only new data are inserted)
   * @param {User[]} object Array {@link User} to update
   * @return {Promise<boolean>} true if {@link User} are updated
   */
  async Update(object: User[]): Promise<boolean> {
    try {
      await this.RealTimeUpdate<User>(object);
      await this.FirestoreUpdate<User>(object);
      return true;
    } catch (e) {
      if (environment.ENV === 'development') {
        console.error(e);
      }
      return false;
    }
  }
}
