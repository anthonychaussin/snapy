import {Base} from './base';
import {NotImplementedException} from './Exception';
import {IBaseObject} from './IBaseObject';

export class Right extends Base implements IBaseObject {
  public static override DBName: string = 'right';
  public Target: string = '0';
  protected _Actions: number[] = [];

  public get Action(): ActionType[] {
    return this._Actions.map(a => a as ActionType);
  }

  ToFirebaseObject(): any {
    throw new NotImplementedException();
  }

  ToRealTimeObject(): any {
    return {
      target: this.Target,
      actions: this._Actions
    };
  }

  get FirestorePath(): string {
    throw new NotImplementedException();
  }

  get RealTimePath(): string {
    return '';
  }
}

export enum ActionType {
  READ = 0,
  CREATE = 1,
  UPDATE = 2,
  DELETE = 3,
}
