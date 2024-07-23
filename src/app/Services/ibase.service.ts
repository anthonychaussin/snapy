export interface IBaseService<T> {
  FirestoreName: string | undefined;
  RealTimeName: string | undefined;

  Save(object: T[]): boolean;

  Get(uuid: string): T;

  GetAll(uuid: string[]): T[];

  Update(object: T): T;

  Delete(uuid: string[]): Promise<boolean>;
}
