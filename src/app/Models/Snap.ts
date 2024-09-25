import {Base, Task, User} from '../Models';
import {NotImplementedException} from './Exception';
import {IBaseObject} from './IBaseObject';

export class Snap extends Base implements IBaseObject {
  public static override DBName: string = 'snap';
  private userUuid: string = '0';
  private taskUuid: string = '0';

  /**
   * The {@link User} that created the {@link Snap}
   * @type {User | undefined}
   */
  public User: User | undefined;
  /**
   * Date of snap, current date time by default
   * @type {Date}
   */
  public DateTime: Date = new Date();
  /**
   * {@link Task} on witch point the snap
   * @type {Task | undefined}
   */
  public Task: Task | undefined;

  /**
   * Path to object in Firestore DB
   * @return {string}
   */
  get FirestorePath(): string {
    return Snap.DBName;
  }

  constructor(data: any) {
    super(data.uuid, data.name);
    Object.assign(this, data);
  }

  /**
   * Convert object to Firestore object
   * Only new element are out
   * @return {any}
   */
  ToFirebaseObject(): any {
    return {
      userUuid: this.userUuid,
      taskUuid: this.taskUuid,
      createdAt: this.DateTime,
      ...this.BaseToObject()
    };
  }

  ToRealTimeObject(): any {
    throw new NotImplementedException();
  }

  get RealTimePath(): string {
    throw new NotImplementedException();
  }

  set RealTimePath(parentsIds: Map<string, string>) {
    throw new NotImplementedException();
  }
}
