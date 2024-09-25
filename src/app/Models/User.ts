import {User as AuthUser} from '@angular/fire/auth';
import {Base, Right} from '../Models';
import {IBaseObject} from './IBaseObject';

export class User extends Base implements IBaseObject {

  public static override DBName: string = 'user';

  /**
   * User's email
   * @type {string}
   */
  public Email: string = '';
  /**
   * User's phone number
   * @type {string}
   */
  public PhoneNumber: string = '';
  /**
   * User's first name (Anonymous by default)
   * @type {string}
   */
  public FirstName: string = 'Anonymous';
  /**
   * User's first name
   * @type {string}
   */
  public LastName: string = '';
  /**
   * Array of {@link Right} of {@link Company}
   * @type {Right[]}
   */
  public CompanyRight: Right[] = [];
  /**
   * Array of {@link Right} of {@link Department}
   * @type {Right[]}
   */
  public DepartmentRight: Right[] = [];
  /**
   * Array of {@link Right} of {@link Team}
   * @type {Right[]}
   */
  public TeamRight: Right[] = [];
  /**
   * User have followed the mail verification process
   * @type {boolean}
   */
  public EmailVerified: boolean = false;
  /**
   * User's profile picture
   * @type {string}
   */
  public Avatar: string = 'path to default avatar'; //TODO find a cool photo

  /**
   * Create a new {@link User} from a Firebase Auth User
   * @param {User} authUser
   * @return {User}
   */
  public static NewFromAuthUser(authUser: AuthUser): User {
    let user = new User(authUser.uid, authUser.displayName ?? 'Anonymous');
    user.Email = authUser.email!;
    user.EmailVerified = authUser.emailVerified;
    user.Avatar = authUser.photoURL ?? 'path to default avatar';
    return user;
  }

  /**
   * Convert object to Firestore object
   * Only new element are out
   * @return {any}
   */
  ToFirebaseObject(): any {
    return {
      company_rights: this.CompanyRight,
      department_rights: this.DepartmentRight,
      team_rights: this.TeamRight
    };
  }

  /**
   * Convert object to Realtime object
   * Only new element are out
   * @return {any}
   */
  ToRealTimeObject(): any {
    return {
      email: this.Email,
      phone_number: this.PhoneNumber,
      first_name: this.FirstName,
      last_name: this.LastName
    };
  }

  /**
   * User's display name
   * @return {string}
   */
  get DisplayName(): string {
    return this.FirstName + ' ' + this.LastName;
  }

  /**
   * Path to object in Firestore DB
   * @return {string}
   */
  get FirestorePath(): string {
    return User.DBName;
  }

  /**
   * Path to object in Realtime DB
   * @return {string}
   */
  get RealTimePath(): string {
    return User.DBName;
  }
}
