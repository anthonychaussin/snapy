export interface IBaseObject {
  Uuid: string;
  Name: string;
  ParentsIds: Map<string, string>;

  get RealTimePath(): string;

  get FirestorePath(): string;

  set RealTimePath(parentsIds: Map<string, string>);

  set FirestorePath(parentsIds: Map<string, string>);

  ToRealTimeObject(): any;

  ToFirebaseObject(): any;
}
