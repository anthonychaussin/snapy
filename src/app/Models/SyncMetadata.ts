import {Base} from './base';
import {IBaseObject} from './IBaseObject';

export class SyncMetadata extends Base implements IBaseObject {
  public static override DBName: string = 'sync_metadata';

  public EntityType: string = ''; // e.g., 'time_entry', 'project', etc.
  public EntityId: string = '';
  public LastSyncedAt: Date = new Date();
  public IsPending: boolean = false;
  public PendingOperation: 'create' | 'update' | 'delete' | null = null;
  public ConflictResolution?: 'local' | 'remote' | 'manual';

  constructor(data: any) {
    super(data.uuid || '', data.entity_type || '');
    Object.assign(this, data);

    if (data.last_synced_at && typeof data.last_synced_at === 'string') {
      this.LastSyncedAt = new Date(data.last_synced_at);
    }
  }

  ToFirebaseObject(): any {
    return {
      entity_type: this.EntityType,
      entity_id: this.EntityId,
      last_synced_at: this.LastSyncedAt.toISOString(),
      is_pending: this.IsPending,
      pending_operation: this.PendingOperation,
      conflict_resolution: this.ConflictResolution || null,
      ...this.BaseToObject()
    };
  }

  ToRealTimeObject(): any {
    return {
      entity_type: this.EntityType,
      entity_id: this.EntityId,
      last_synced_at: this.LastSyncedAt.toISOString(),
      is_pending: this.IsPending,
      pending_operation: this.PendingOperation,
      conflict_resolution: this.ConflictResolution || null,
      ...this.BaseToObject()
    };
  }

  get FirestorePath(): string {
    return SyncMetadata.DBName;
  }

  get RealTimePath(): string {
    return SyncMetadata.DBName;
  }

  set FirestorePath(parentsIds: Map<string, string>) {
    // Not applicable
  }

  set RealTimePath(parentsIds: Map<string, string>) {
    // Not applicable
  }
}

