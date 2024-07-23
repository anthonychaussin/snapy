import {Base} from '../Models';

export class Right extends Base {
  public Target: string;
  protected _Actions: number[];

  public get Action(): ActionType[] {
    return this._Actions.map(a => a as ActionType);
  }
}

export enum ActionType {
  READ = 0,
  CREATE = 1,
  UPDATE = 2,
  DELETE = 3,
}
