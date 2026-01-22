export interface IFirebaseService<T> {
  Save(object: T[]): Promise<T[]>;

  Get(basePath: string, uuid: string): Promise<T | void>;

  GetAll(basePath: string, uuid: string[]): Promise<(T | void)[]>;

  Update(object: T[]): Promise<boolean>;

  Delete(object: T[]): Promise<boolean>;
}
