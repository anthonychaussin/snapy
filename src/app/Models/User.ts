import {Base, Right} from '../Models';
import {IBaseObject} from './IBaseObject';

export class User extends Base implements IBaseObject {

  public static override DBName: string = 'user';

  public Email: string = '';
  public Password: string = '';
  public PhoneNumber: string = '';
  public FirstName: string = 'Anonymous';
  public LastName: string = '';
  public CompanyRight: Right[] = [];
  public DepartmentRight: Right[] = [];
  public TeamRight: Right[] = [];

  ToFirebaseObject(): any {
    return {
      company_rights: this.CompanyRight,
      department_rights: this.DepartmentRight,
      team_rights: this.TeamRight
    };
  }

  ToRealTimeObject(): any {
    return {
      email: this.Email,
      phone_number: this.PhoneNumber,
      first_name: this.FirstName,
      last_name: this.LastName
    };
  }

  get DisplayName(): string {
    return this.FirstName + ' ' + this.LastName;
  }

  get FirestorePath(): string {
    return User.DBName;
  }

  get RealTimePath(): string {
    return User.DBName;
  }
}
