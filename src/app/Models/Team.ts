import {Base, Company, Department, Project, User} from '../Models';
import {NotFoundException, NotImplementedException} from './Exception';
import {IBaseObject} from './IBaseObject';

export class Team extends Base implements IBaseObject {
  public static override DBName: string = 'team';

  public Users: User[] = [];
  public Projects: Project[] = [];

  get RealTimePath(): string {
    if (!this.ParentsIds.has(Company.DBName)) {
      throw new NotFoundException('You must provide the parent Company uuid');
    }
    if (!this.ParentsIds.has(Department.DBName)) {
      throw new NotFoundException('You must provide the parent Department uuid');
    }
    return `${Company.DBName}/${this.ParentsIds.get(Company.DBName)}/${Department.DBName}/${this.ParentsIds.get(Department.DBName)}/${Team.DBName}`;
  }

  constructor(data: any) {
    super(data.uuid, data.name);
    Object.assign(this, data);

    let parentId = new Map<string, string>();
    parentId.set(Company.DBName, <string> this.ParentsIds.get(Company.DBName));
    parentId.set(Department.DBName, <string> this.ParentsIds.get(Department.DBName));
    parentId.set(Team.DBName, this.Uuid);
    this.Projects.forEach(d => d.ParentsIds = parentId);
    this.Projects = this.Projects.map(d => new Project(d));
  }

  ToRealTimeObject(): any {
    return {
      users: this.Users.map(u => u.Uuid),
      project: this.Projects,
      ...this.BaseToObject()
    };
  }

  get FirestorePath(): string {
    throw new NotImplementedException();
  }

  set FirestorePath(parentsIds: Map<string, string>) {
    throw new NotImplementedException();
  }

  ToFirebaseObject(): any {
    throw new NotImplementedException();
  }
}
