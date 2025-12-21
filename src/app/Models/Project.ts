import {Base, Company, Department, Task, Team} from '../Models';
import {NotFoundException} from './Exception';
import {IBaseObject} from './IBaseObject';

export enum ProjectStatus {
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class Project extends Base implements IBaseObject {
  public static override DBName: string = 'project';

  // Legacy task support (kept for backward compatibility)
  public Task: Task[] = [];

  // Project properties
  public Status: ProjectStatus = ProjectStatus.ACTIVE;
  public Description?: string;
  public StartDate?: Date;
  public EndDate?: Date;
  public Budget?: number;
  public Color?: string; // For UI display

  // Sub-projects support
  public ParentProjectId?: string; // If null, this is a top-level project
  public SubProjects: Project[] = [];

  // Team and department associations
  public TeamIds: string[] = []; // Projects can belong to multiple teams
  public ManagerIds: string[] = []; // User IDs of project managers

  // Metadata
  public CreatedAt: Date = new Date();
  public UpdatedAt: Date = new Date();
  public IsActive: boolean = true;

  constructor(data: any) {
    super(data.uuid || '', data.name || '');
    Object.assign(this, data);

    if (data.start_date && typeof data.start_date === 'string') {
      this.StartDate = new Date(data.start_date);
    }
    if (data.end_date && typeof data.end_date === 'string') {
      this.EndDate = new Date(data.end_date);
    }
    if (data.created_at && typeof data.created_at === 'string') {
      this.CreatedAt = new Date(data.created_at);
    }
    if (data.updated_at && typeof data.updated_at === 'string') {
      this.UpdatedAt = new Date(data.updated_at);
    }

    // Initialize sub-projects
    if (data.sub_projects && Array.isArray(data.sub_projects)) {
      this.SubProjects = data.sub_projects.map((sp: any) => new Project(sp));
    }

    // Legacy task initialization
    let parentId = new Map<string, string>();
    if (this.ParentsIds.has(Company.DBName)) {
      parentId.set(Company.DBName, <string> this.ParentsIds.get(Company.DBName));
    }
    if (this.ParentsIds.has(Department.DBName)) {
      parentId.set(Department.DBName, <string> this.ParentsIds.get(Department.DBName));
    }
    if (this.ParentsIds.has(Team.DBName)) {
      parentId.set(Team.DBName, <string> this.ParentsIds.get(Team.DBName));
    }
    parentId.set(Project.DBName, this.Uuid);
    this.Task.forEach(t => t.ParentsIds = parentId);
    this.Task = this.Task.map(t => new Task(t));
  }

  ToRealTimeObject(): any {
    return {
      status: this.Status,
      description: this.Description || null,
      start_date: this.StartDate ? this.StartDate.toISOString() : null,
      end_date: this.EndDate ? this.EndDate.toISOString() : null,
      budget: this.Budget || null,
      color: this.Color || null,
      parent_project_id: this.ParentProjectId || null,
      team_ids: this.TeamIds || [],
      manager_ids: this.ManagerIds || [],
      created_at: this.CreatedAt.toISOString(),
      updated_at: this.UpdatedAt.toISOString(),
      is_active: this.IsActive,
      // Legacy
      task: this.Task,
      ...this.BaseToObject()
    };
  }

  get RealTimePath(): string {
    // Simplified path - projects can be queried by company/department
    if (!this.ParentsIds.has(Company.DBName)) {
      throw new NotFoundException('You must provide the parent Company uuid');
    }
    if (!this.ParentsIds.has(Department.DBName)) {
      throw new NotFoundException('You must provide the parent Department uuid');
    }

    const basePath = `${Company.DBName}/${this.ParentsIds.get(Company.DBName)}/${Department.DBName}/${this.ParentsIds.get(Department.DBName)}/${Project.DBName}`;

    // If team is specified, include it in path (for backward compatibility)
    if (this.ParentsIds.has(Team.DBName)) {
      return `${basePath}/${Team.DBName}/${this.ParentsIds.get(Team.DBName)}`;
    }

    return basePath;
  }

  ToFirebaseObject(): any {
    return {
      status: this.Status,
      description: this.Description || null,
      start_date: this.StartDate ? this.StartDate.toISOString() : null,
      end_date: this.EndDate ? this.EndDate.toISOString() : null,
      budget: this.Budget || null,
      color: this.Color || null,
      parent_project_id: this.ParentProjectId || null,
      team_ids: this.TeamIds || [],
      manager_ids: this.ManagerIds || [],
      created_at: this.CreatedAt.toISOString(),
      updated_at: this.UpdatedAt.toISOString(),
      is_active: this.IsActive,
      ...this.BaseToObject()
    };
  }

  get FirestorePath(): string {
    if (!this.ParentsIds.has(Company.DBName)) {
      throw new NotFoundException('You must provide the parent Company uuid');
    }
    if (!this.ParentsIds.has(Department.DBName)) {
      throw new NotFoundException('You must provide the parent Department uuid');
    }
    return `${Company.DBName}/${this.ParentsIds.get(Company.DBName)}/${Department.DBName}/${this.ParentsIds.get(Department.DBName)}/${Project.DBName}`;
  }

  set FirestorePath(parentsIds: Map<string, string>) {
    this.ParentsIds = parentsIds;
  }

  set RealTimePath(parentsIds: Map<string, string>) {
    this.ParentsIds = parentsIds;
  }
}
