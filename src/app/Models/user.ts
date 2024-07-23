import {Base, Right} from '../Models';

export class User extends Base {
  public Email: string;
  public Password: string;
  public PhoneNumber: string;
  public FirstName: string;
  public LastName: string;
  public CompanyRight: Right[];
  public DepartmentRight: Right[];
  public TeamRight: Right[];
}
