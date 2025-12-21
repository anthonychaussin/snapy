import {Base} from './base';
import {IBaseObject} from './IBaseObject';
import {Project} from './Project';
import {User} from './User';

export enum TimeEntryStatus {
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class TimeEntry extends Base implements IBaseObject {
  public static override DBName: string = 'time_entry';

  // User who created this time entry
  public UserId: string = '';
  public User?: User;

  // Project and optional sub-project
  public ProjectId: string = '';
  public Project?: Project;
  public SubProjectId?: string; // Optional sub-project

  // Time tracking
  public StartTime: Date = new Date();
  public EndTime?: Date;
  public Duration: number = 0; // Duration in seconds
  public Status: TimeEntryStatus = TimeEntryStatus.RUNNING;

  // Description/notes
  public Description: string = '';
  public Notes?: string;

  // Offline sync support
  public IsSynced: boolean = false;
  public LastModified: Date = new Date();
  public CreatedAt: Date = new Date();

  // Location (optional, for mobile)
  public Location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  constructor(data: any) {
    super(data.uuid || '', data.name || data.description || '');
    Object.assign(this, data);

    // Convert date strings to Date objects
    if (data.start_time && typeof data.start_time === 'string') {
      this.StartTime = new Date(data.start_time);
    }
    if (data.end_time && typeof data.end_time === 'string') {
      this.EndTime = new Date(data.end_time);
    }
    if (data.last_modified && typeof data.last_modified === 'string') {
      this.LastModified = new Date(data.last_modified);
    }
    if (data.created_at && typeof data.created_at === 'string') {
      this.CreatedAt = new Date(data.created_at);
    }
  }

  /**
   * Calculate duration from start and end times
   */
  public CalculateDuration(): number {
    if (this.EndTime && this.StartTime) {
      this.Duration = Math.floor((this.EndTime.getTime() - this.StartTime.getTime()) / 1000);
    }
    return this.Duration;
  }

  /**
   * Get duration in hours
   */
  public get DurationInHours(): number {
    return this.Duration / 3600;
  }

  /**
   * Get duration formatted as HH:MM:SS
   */
  public get FormattedDuration(): string {
    const hours = Math.floor(this.Duration / 3600);
    const minutes = Math.floor((this.Duration % 3600) / 60);
    const seconds = this.Duration % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  ToFirebaseObject(): any {
    return {
      user_id: this.UserId,
      project_id: this.ProjectId,
      sub_project_id: this.SubProjectId || null,
      start_time: this.StartTime.toISOString(),
      end_time: this.EndTime ? this.EndTime.toISOString() : null,
      duration: this.Duration,
      status: this.Status,
      description: this.Description,
      notes: this.Notes || null,
      is_synced: this.IsSynced,
      last_modified: this.LastModified.toISOString(),
      created_at: this.CreatedAt.toISOString(),
      location: this.Location || null,
      ...this.BaseToObject()
    };
  }

  ToRealTimeObject(): any {
    return {
      user_id: this.UserId,
      project_id: this.ProjectId,
      sub_project_id: this.SubProjectId || null,
      start_time: this.StartTime.toISOString(),
      end_time: this.EndTime ? this.EndTime.toISOString() : null,
      duration: this.Duration,
      status: this.Status,
      description: this.Description,
      notes: this.Notes || null,
      is_synced: this.IsSynced,
      last_modified: this.LastModified.toISOString(),
      created_at: this.CreatedAt.toISOString(),
      location: this.Location || null,
      ...this.BaseToObject()
    };
  }

  get FirestorePath(): string {
    return `${TimeEntry.DBName}`;
  }

  get RealTimePath(): string {
    return `${TimeEntry.DBName}`;
  }

  set FirestorePath(parentsIds: Map<string, string>) {
    // Not applicable - TimeEntry is stored at root level with indexes
  }

  set RealTimePath(parentsIds: Map<string, string>) {
    // Not applicable - TimeEntry is stored at root level with indexes
  }
}

