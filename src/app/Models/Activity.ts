import {Base} from './base';
import {IBaseObject} from './IBaseObject';
import {User} from './User';

export enum ActivityType {
  TIME_ENTRY_CREATED = 'time_entry_created',
  TIME_ENTRY_UPDATED = 'time_entry_updated',
  TIME_ENTRY_DELETED = 'time_entry_deleted',
  PROJECT_CREATED = 'project_created',
  PROJECT_UPDATED = 'project_updated',
  PROJECT_DELETED = 'project_deleted',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PROFILE_UPDATED = 'profile_updated'
}

export class Activity extends Base implements IBaseObject {
  public static override DBName: string = 'activity';

  public UserId: string = '';
  public User?: User;

  public ActivityType: ActivityType = ActivityType.LOGIN;
  public Timestamp: Date = new Date();
  public Description: string = '';
  public Metadata?: any; // Additional data specific to activity type

  constructor(data: any) {
    super(data.uuid || '', data.description || '');
    Object.assign(this, data);

    if (data.timestamp && typeof data.timestamp === 'string') {
      this.Timestamp = new Date(data.timestamp);
    }
  }

  ToFirebaseObject(): any {
    return {
      user_id: this.UserId,
      activity_type: this.ActivityType,
      timestamp: this.Timestamp.toISOString(),
      description: this.Description,
      metadata: this.Metadata || null,
      ...this.BaseToObject()
    };
  }

  ToRealTimeObject(): any {
    return {
      user_id: this.UserId,
      activity_type: this.ActivityType,
      timestamp: this.Timestamp.toISOString(),
      description: this.Description,
      metadata: this.Metadata || null,
      ...this.BaseToObject()
    };
  }

  get FirestorePath(): string {
    return Activity.DBName;
  }

  get RealTimePath(): string {
    return Activity.DBName;
  }

  set FirestorePath(parentsIds: Map<string, string>) {
    // Not applicable
  }

  set RealTimePath(parentsIds: Map<string, string>) {
    // Not applicable
  }
}

