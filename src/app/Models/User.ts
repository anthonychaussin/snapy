import {Base} from './base';
import {IBaseObject} from './IBaseObject';
import {Right} from './Right';
import {Role, RoleType} from './Role';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export class User extends Base implements IBaseObject {

  public static override DBName: string = 'user';

  public Email: string = '';
  // NOTE: Password should NEVER be stored in plain text
  // Use Firebase Authentication instead - this field is deprecated
  /** @deprecated Use Firebase Authentication instead */
  public Password: string = '';
  public PhoneNumber: string = '';
  public FirstName: string = 'Anonymous';
  public LastName: string = '';
  public Status: UserStatus = UserStatus.ACTIVE;

  // Role management
  public RoleId?: string;
  public Role?: Role;
  public RoleType: RoleType = RoleType.EMPLOYEE;

  // Legacy rights (kept for backward compatibility)
  public CompanyRight: Right[] = [];
  public DepartmentRight: Right[] = [];
  public TeamRight: Right[] = [];

  // Company and department associations
  public CompanyId?: string;
  public DepartmentId?: string;
  public TeamIds: string[] = [];

  // Profile
  public AvatarUrl?: string;
  public JobTitle?: string;
  public HireDate?: Date;

  constructor(data: any) {
    super(data.uuid || '', data.name || '');
    Object.assign(this, data);

    if (data.hire_date && typeof data.hire_date === 'string') {
      this.HireDate = new Date(data.hire_date);
    }
  }

  ToFirebaseObject(): any {
    return {
      email: this.Email,
      phone_number: this.PhoneNumber,
      first_name: this.FirstName,
      last_name: this.LastName,
      status: this.Status,
      role_id: this.RoleId || null,
      role_type: this.RoleType,
      company_id: this.CompanyId || null,
      department_id: this.DepartmentId || null,
      team_ids: this.TeamIds || [],
      avatar_url: this.AvatarUrl || null,
      job_title: this.JobTitle || null,
      hire_date: this.HireDate ? this.HireDate.toISOString() : null,
      // Legacy fields (deprecated)
      company_rights: this.CompanyRight,
      department_rights: this.DepartmentRight,
      team_rights: this.TeamRight,
      ...this.BaseToObject()
    };
  }

  ToRealTimeObject(): any {
    return {
      email: this.Email,
      phone_number: this.PhoneNumber,
      first_name: this.FirstName,
      last_name: this.LastName,
      status: this.Status,
      role_id: this.RoleId || null,
      role_type: this.RoleType,
      company_id: this.CompanyId || null,
      department_id: this.DepartmentId || null,
      team_ids: this.TeamIds || [],
      avatar_url: this.AvatarUrl || null,
      job_title: this.JobTitle || null,
      hire_date: this.HireDate ? this.HireDate.toISOString() : null,
      // Legacy fields (deprecated)
      company_rights: this.CompanyRight,
      department_rights: this.DepartmentRight,
      team_rights: this.TeamRight,
      ...this.BaseToObject()
    };
  }

  get DisplayName(): string {
    return `${this.FirstName} ${this.LastName}`.trim() || 'Anonymous';
  }

  get IsManager(): boolean {
    return this.RoleType === RoleType.MANAGER || this.RoleType === RoleType.ADMIN;
  }

  get IsHR(): boolean {
    return this.RoleType === RoleType.HR || this.RoleType === RoleType.ADMIN;
  }

  get IsAdmin(): boolean {
    return this.RoleType === RoleType.ADMIN;
  }

  get FirestorePath(): string {
    return User.DBName;
  }

  get RealTimePath(): string {
    return User.DBName;
  }

  set FirestorePath(parentsIds: Map<string, string>) {
    // Not applicable
  }

  set RealTimePath(parentsIds: Map<string, string>) {
    // Not applicable
  }
}
