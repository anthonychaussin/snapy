import {Base, Department} from '../Models';
import {NotImplementedException} from './Exception';
import {IBaseObject} from './IBaseObject';

export class Company extends Base implements IBaseObject {
  static override DBName: string = 'company';

  public Logo: string = './resources/company_logo.jpeg';
  public Color: string = 'FFF';
  public Departments: Department[] = [];

  get RealTimePath() {
    return Company.DBName;
  }

  constructor(data: any) {
    super(data.uuid, data.name);
    Object.assign(this, data);

    let parentId = new Map<string, string>();
    parentId.set(Company.DBName, this.Uuid);
    this.Departments.forEach(d => d.ParentsIds = parentId);
    this.Departments = this.Departments.map(d => new Department(d));
  }

  public ToRealTimeObject(): any {

    return {
      uuid: this.Uuid,
      name: this.Name,
      logo: this.Logo,
      color: this.Color,
      departments: this.Departments
    };
  }

  public ToFirebaseObject(): any {
    throw new NotImplementedException();
  }

  get FirestorePath(): string {
    throw new NotImplementedException();
  }

  set FirestorePath(parentsIds: Map<string, string>) {
    throw new NotImplementedException();
  }
}
