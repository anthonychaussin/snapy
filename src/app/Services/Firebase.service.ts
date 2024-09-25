import {inject, Injectable} from '@angular/core';
import {child, Database, get, push, ref, set, update} from '@angular/fire/database';
import {doc, Firestore, getDoc, writeBatch} from '@angular/fire/firestore';
import {addDoc, collection} from '@angular/fire/firestore/lite';
import {IBaseObject} from '../Models';
import {NotFoundException} from '../Models/Exception';

@Injectable({
              providedIn: 'root'
            })

export class FirebaseService {

  protected RealTimeDataBase: Database = inject(Database);
  protected FireStore: Firestore = inject(Firestore);

  //GET
  /**
   * Make a get request on realtime database
   * @param {{new(...args: any[]): T}} objectClass class constructor
   * @param {string} path path un db of object
   * @param {string} uuid uuid of object
   * @return {Promise<void | T>} return new instance of object
   * @protected
   */
  protected async RealTimeGet<T>(objectClass: new (...args: any[]) => T, path: string, uuid: string): Promise<T | void> {
    return get(child(ref(this.RealTimeDataBase), `${path}/${uuid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        return new objectClass(
          {
            Uuid: snapshot.key,
            ...snapshot.val()
          });
      } else {
        throw new NotFoundException(`The reference ${uuid} doesn't exist`);
      }
    });
  }

  /**
   * Make a get request on firestore database
   * @param {{new(...args: any[]): T}} objectClass class constructor
   * @param {string} path path un db of object
   * @param {string} uuid uuid of object
   * @return {Promise<void | T>} return new instance of object
   * @protected
   */
  protected async FirestoreGet<T>(objectClass: new (...args: any[]) => T, path: string, uuid: string): Promise<T | void> {
    return getDoc(doc(this.FireStore, path, uuid)).then((snapshot) => {
      if (snapshot.exists()) {
        return new objectClass(
          {
            Uuid: snapshot.ref,
            ...snapshot.data()
          });
      } else {
        throw new NotFoundException(`The reference ${uuid} doesn't exist`);
      }
    });
  }

  // DELETE
  /**
   * Delete list of object in Realtime db
   * @param {T[]} object list of object to delete
   * @return {Promise<void>} void return a promise that resolve when all deletion are finished
   * @protected
   */
  protected RealTimeDelete<T extends IBaseObject>(object: T[]): Promise<void> {
    const batch: any = {};
    object.forEach(u => batch[`${u.RealTimePath}/${u.Uuid}`] = null);
    return update(ref(this.RealTimeDataBase), batch);
  }

  /**
   * Delete list of object in Firestore db
   * @param {T[]} object list of object to delete
   * @return {Promise<void>} void return a promise that resolve when all deletion are finished
   * @protected
   */
  protected FirestoreDelete<T extends IBaseObject>(object: T[]): Promise<void> {
    const batch = writeBatch(this.FireStore);
    object.forEach(u => batch.delete(doc(this.FireStore, u.FirestorePath, u.Uuid)));
    return batch.commit();
  }

  //CREATE
  /**
   * Create list of object in Realtime db
   * @param {T[]} object list of object to create
   * @return {Promise<T[]>} return liste of object with they Uuid
   * @protected
   */
  protected async RealTimeCreate<T extends IBaseObject>(object: T[]): Promise<T[]> {
    let ids: T[] = [];
    await Promise.all(object.map(obj => {
      let newId = push(ref(this.RealTimeDataBase, obj.RealTimePath));
      if (typeof newId.key === 'string') {
        obj.Uuid = newId.key;
        ids.push(obj);
      }

      return set(newId, obj.ToRealTimeObject());
    }));

    return ids;
  }


  /**
   * Create list of object in Firestore db
   * @param {T[]} object list of object to create
   * @return {Promise<T[]>} return liste of object with they Uuid
   * @protected
   */
  protected async FirestoreCreate<T extends IBaseObject>(object: T[]): Promise<T[]> {
    let ids: T[] = [];
    await Promise.all(object.map(async obj => {
      return addDoc(collection(this.FireStore, obj.FirestorePath), obj.ToFirebaseObject()).then(newId => {
        obj.Uuid = newId.id;
        ids.push(obj);
      });
    }));

    return ids;
  }

  //UPDATE
  /**
   * Create list of object in Realtime db
   * @param {T[]} object list of object to create
   * @return {Promise<void>} void return a promise that resolve when all updates are finished
   * @protected
   */
  protected RealTimeUpdate<T extends IBaseObject>(object: T[]): Promise<void> {
    const updates = new Map();
    object.forEach(obj => updates.set(`${obj.RealTimePath}/${obj.Uuid}`, obj.ToRealTimeObject()));
    return update(ref(this.RealTimeDataBase), updates);
  }

  /**
   * Create list of object in Firestore db
   * @param {T[]} object list of object to create
   * @return {Promise<void>} void return a promise that resolve when all updates are finished
   * @protected
   */
  protected FirestoreUpdate<T extends IBaseObject>(object: T[]): Promise<void> {
    const batch = writeBatch(this.FireStore);
    object.forEach(obj => batch.update(doc(this.FireStore, `${obj.FirestorePath}/${obj.Uuid}`), obj.ToFirebaseObject()));
    return batch.commit();
  }
}
