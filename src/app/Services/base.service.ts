import {inject, Injectable} from '@angular/core';
import {Database, ref, update} from '@angular/fire/database';
import {doc, Firestore, writeBatch} from '@angular/fire/firestore';

@Injectable({
              providedIn: 'root'
            })
export class BaseService {

  protected RealTimeDataBase: Database = inject(Database);
  protected FireStore: Firestore = inject(Firestore);

  constructor() { }

  //GET


  // DELETE
  protected RealTimeDelete(path: string, uuid: string[]): Promise<void> {
    const batch: any = {};
    uuid.forEach(u => batch[`${path}/${u}`] = null);
    return update(ref(this.RealTimeDataBase), batch);
  }

  protected FirestoreDelete(path: string, uuid: string[]): Promise<void> {
    const batch = writeBatch(this.FireStore);
    uuid.forEach(u => batch.delete(doc(this.FireStore, path, u)));
    return batch.commit();
  }
}
