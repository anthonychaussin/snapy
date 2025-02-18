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

  constructor() { }

  //GET
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
  protected RealTimeDelete<T extends IBaseObject>(object: T[]): Promise<void> {
    const batch: any = {};
    object.forEach(u => batch[`${u.RealTimePath}/${u.Uuid}`] = null);
    return update(ref(this.RealTimeDataBase), batch);
  }

  protected FirestoreDelete<T extends IBaseObject>(object: T[]): Promise<void> {
    const batch = writeBatch(this.FireStore);
    object.forEach(u => batch.delete(doc(this.FireStore, u.FirestorePath, u.Uuid)));
    return batch.commit();
  }

  //CREATE
  protected async RealTimeCreate<T extends IBaseObject>(o: T[]): Promise<T[]> {
    let ids: T[] = [];
    await Promise.all(o.map(obj => {
      let newId = push(ref(this.RealTimeDataBase, obj.RealTimePath));
      if (typeof newId.key === 'string') {
        obj.Uuid = newId.key;
        ids.push(obj);
      }

      return set(newId, obj.ToRealTimeObject());
    }));

    return ids;
  }

  protected async FirestoreCreate<T extends IBaseObject>(o: T[]): Promise<T[]> {
    let ids: T[] = [];
    await Promise.all(o.map(async obj => {
      return addDoc(collection(this.FireStore, obj.FirestorePath), obj.ToFirebaseObject()).then(newId => {
        obj.Uuid = newId.id;
        ids.push(obj);
      });
    }));

    return ids;
  }

  //UPDATE
  protected RealTimeUpdate<T extends IBaseObject>(o: T[]): Promise<void> {
    const updates = new Map();
    o.forEach(obj => updates.set(`${obj.RealTimePath}/${obj.Uuid}`, obj.ToRealTimeObject()));
    return update(ref(this.RealTimeDataBase), updates);
  }

  protected FirestoreUpdate<T extends IBaseObject>(o: T[]): Promise<void> {
    const batch = writeBatch(this.FireStore);
    o.forEach(obj => batch.update(doc(this.FireStore, `${obj.FirestorePath}/${obj.Uuid}`), obj.ToFirebaseObject()));
    return batch.commit();
  }
}
