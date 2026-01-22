import {Base, Company, Department, Project, Team} from '../Models';
import {NotFoundException, NotImplementedException} from './Exception';
import {IBaseObject} from './IBaseObject';

export class Task extends Base implements IBaseObject {
  public static override DBName: string = 'task';

  ToRealTimeObject(): any {
    return this.BaseToObject();
  }

  get RealTimePath(): string {
    if (!this.ParentsIds.has(Company.DBName)) {
      throw new NotFoundException('You must provide the parent Company uuid');
    }
    if (!this.ParentsIds.has(Department.DBName)) {
      throw new NotFoundException('You must provide the parent Department uuid');
    }
    if (!this.ParentsIds.has(Team.DBName)) {
      throw new NotFoundException('You must provide the parent Team uuid');
    }
    if (!this.ParentsIds.has(Project.DBName)) {
      throw new NotFoundException('You must provide the parent Project uuid');
    }

    return `${Company.DBName}/${this.ParentsIds.get(Company.DBName)}/${Department.DBName}/${this.ParentsIds.get(Department.DBName)}/${Team.DBName}/${this.ParentsIds.get(Team.DBName)}/${Project.DBName}/${this.ParentsIds.get(Project.DBName)}/${Task.DBName}`;
  }

  constructor(data: any) {
    super(data.uuid, data.name);
    Object.assign(this, data);
  }

  ToFirebaseObject(): any {
    throw new NotImplementedException();
  }

  get FirestorePath(): string {
    throw new NotImplementedException();
  }

  set FirestorePath(parentsIds: Map<string, string>) {
    throw new NotImplementedException();
  }
}
