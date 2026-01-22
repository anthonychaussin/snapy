import {Base, Task, User} from '../Models';
import {NotImplementedException} from './Exception';
import {IBaseObject} from './IBaseObject';

export class Snap extends Base implements IBaseObject {
  public static override DBName: string = 'snap';
  private userUuid: string = '0';
  private taskUuid: string = '0';

  public User: User | undefined;
  public DateTime: Date = new Date();
  public Task: Task | undefined;

  get FirestorePath(): string {
    return Snap.DBName;
  }

  constructor(data: any) {
    super(data.uuid, data.name);
    Object.assign(this, data);
  }

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
