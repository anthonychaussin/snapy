import {Base} from './base';
import {IBaseObject} from './IBaseObject';

export enum RoleType {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  HR = 'hr',
  ADMIN = 'admin'
}

export class Role extends Base implements IBaseObject {
  public static override DBName: string = 'role';

  public RoleType: RoleType = RoleType.EMPLOYEE;
  public Description: string = '';
  public Permissions: string[] = [];

  constructor(data: any) {
    super(data.uuid || '', data.name || '');
    Object.assign(this, data);
  }

  ToFirebaseObject(): any {
    return {
      role_type: this.RoleType,
      description: this.Description,
      permissions: this.Permissions,
      ...this.BaseToObject()
    };
  }

  ToRealTimeObject(): any {
    return {
      role_type: this.RoleType,
      description: this.Description,
      permissions: this.Permissions,
      ...this.BaseToObject()
    };
  }

  get FirestorePath(): string {
    return Role.DBName;
  }

  get RealTimePath(): string {
    return Role.DBName;
  }

  set FirestorePath(parentsIds: Map<string, string>) {
    // Not applicable for Role
  }

  set RealTimePath(parentsIds: Map<string, string>) {
    // Not applicable for Role
  }
}

