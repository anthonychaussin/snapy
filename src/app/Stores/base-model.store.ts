import {computed, signal} from '@angular/core';
import {FirebaseError} from 'firebase/app';
import type {IBaseObject} from '../Models';
import type {IFirebaseService} from '../Services/IFirebase.service';

export type StoreStatus = 'idle' | 'loading' | 'error';

export abstract class BaseModelStore<T extends IBaseObject> {
  private readonly _entities = signal(new Map<string, T>());
  readonly entities = computed(() => Array.from(this._entities().values()));
  readonly entityCount = computed(() => this._entities().size);

  private readonly _selectedId = signal<string | null>(null);
  readonly selectedEntity = computed(() => {
    const selected = this._selectedId();
    return selected ? this._entities().get(selected) ?? null : null;
  });

  private readonly _status = signal<StoreStatus>('idle');
  readonly status = computed(() => this._status());
  readonly isLoading = computed(() => this._status() === 'loading');

  private readonly _error = signal<string | null>(null);
  readonly error = computed(() => this._error());

  protected constructor(
    protected readonly service: IFirebaseService<T>,
    protected readonly defaultBasePath: string
  ) {}

  select(id: string | null) {
    this._selectedId.set(id);
  }

  clear() {
    this._entities.set(new Map());
    this._selectedId.set(null);
    this._status.set('idle');
    this._error.set(null);
  }

  async load(id: string, basePath?: string): Promise<T | void> {
    const result = await this.withStatus(() => this.service.Get(basePath ?? this.defaultBasePath, id));
    this.upsert([result]);
    return result;
  }

  async loadMany(ids: string[], basePath?: string): Promise<(T | void)[]> {
    const results = await this.withStatus(() => this.service.GetAll(basePath ?? this.defaultBasePath, ids));
    this.upsert(results);
    return results;
  }

  async save(items: T[]): Promise<T[]> {
    const created = await this.withStatus(() => this.service.Save(items));
    this.upsert(created);
    return created;
  }

  async update(items: T[]): Promise<boolean> {
    const result = await this.withStatus(() => this.service.Update(items));
    this.upsert(items);
    return result;
  }

  async delete(items: T[]): Promise<boolean> {
    const result = await this.withStatus(() => this.service.Delete(items));
    if (result) {
      this.removeByIds(items.map(item => item.Uuid));
    }
    return result;
  }

  protected getEntity(id: string): T | null {
    return this._entities().get(id) ?? null;
  }

  protected removeByIds(ids: string[]) {
    if (!ids.length) {
      return;
    }

    this._entities.update(current => {
      const copy = new Map(current);
      ids.forEach(id => copy.delete(id));
      return copy;
    });
  }

  private upsert(entries: (T | void)[]) {
    if (!entries || !entries.length) {
      return;
    }

    this._entities.update(current => {
      const copy = new Map(current);
      for (const entry of entries) {
        if (!entry || !entry.Uuid) {
          continue;
        }
        copy.set(entry.Uuid, entry);
      }
      return copy;
    });
  }

  private async withStatus<R>(action: () => Promise<R>): Promise<R> {
    this._status.set('loading');
    this._error.set(null);

    try {
      const result = await action();
      this._status.set('idle');
      return result;
    } catch (error) {
      this._status.set('error');
      this._error.set(this.formatErrorMessage(error));
      throw error;
    }
  }

  private formatErrorMessage(error: unknown): string {
    if (error instanceof FirebaseError || error instanceof Error) {
      return error.message;
    }
    return 'Une erreur est survenue en communiquant avec Firebase.';
  }
}
