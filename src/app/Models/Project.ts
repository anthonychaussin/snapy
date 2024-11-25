import {Base, Company, Department, Task, Team} from '../Models';
import {NotFoundException, NotImplementedException} from './Exception';
import {IBaseObject} from './IBaseObject';

export class Project extends Base implements IBaseObject {
  public static override DBName: string = 'project';
  public Task: Task[] = [];

  ToRealTimeObject(): any {
    return {
      task: Task,
      ...this.BaseToObject()
    };
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

    return `${Company.DBName}/${this.ParentsIds.get(Company.DBName)}/${Department.DBName}/${this.ParentsIds.get(Department.DBName)}/${Team.DBName}/${this.ParentsIds.get(Team.DBName)}/${Project.DBName}`;
  }

  constructor(data: any) {
    super(data.uuid, data.name);
    Object.assign(this, data);

    let parentId = new Map<string, string>();
    parentId.set(Company.DBName, <string> this.ParentsIds.get(Company.DBName));
    parentId.set(Department.DBName, <string> this.ParentsIds.get(Department.DBName));
    parentId.set(Team.DBName, <string> this.ParentsIds.get(Team.DBName));
    parentId.set(Project.DBName, this.Uuid);
    this.Task.forEach(t => t.ParentsIds = parentId);
    this.Task = this.Task.map(t => new Task(t));
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
