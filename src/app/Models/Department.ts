import {Base, Company, Team} from '../Models';
import {NotFoundException, NotImplementedException} from './Exception';
import {IBaseObject} from './IBaseObject';

export class Department extends Base implements IBaseObject {
  static override DBName: string = 'department';

  public Teams: Team[] = [];

  get RealTimePath(): string {
    if (!this.ParentsIds.has(Company.DBName)) {
      throw new NotFoundException('You must provide the parent Company uuid');
    }
    return `${Company.DBName}/${this.ParentsIds.get(Company.DBName)}/${Department.DBName}`;
  }

  constructor(data: any) {
    super(data.uuid, data.name);
    Object.assign(this, data);

    let parentId = new Map<string, string>();
    parentId.set(Company.DBName, <string> this.ParentsIds.get(Company.DBName));
    parentId.set(Department.DBName, this.Uuid);
    this.Teams.forEach(d => d.ParentsIds = parentId);
    this.Teams = this.Teams.map(t => new Team(t));
  }

  ToRealTimeObject(): any {
    return {
      teams: this.Teams,
      ...super.BaseToObject()
    };
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
