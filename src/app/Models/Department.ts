import {Base, Company, Team} from '../Models';
import {NotFoundException, NotImplementedException} from './Exception';
import {IBaseObject} from './IBaseObject';

export class Department extends Base implements IBaseObject {
  static override DBName: string = 'department';

  /**
   * Array of {@link Team} in this department
   * @type {Team[]}
   */
  public Teams: Team[] = [];

  /**
   * Path to object in Realtime DB
   * @return {string}
   */
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

  /**
   * Convert object to Firestore object
   * Only new element are out
   * @return {any}
   */
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
