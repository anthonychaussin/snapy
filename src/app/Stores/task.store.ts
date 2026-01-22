import {Injectable} from '@angular/core';
import {Task} from '../Models';
import {TaskService} from '../Services/Task.service';
import {BaseModelStore} from './base-model.store';

@Injectable({
              providedIn: 'root'
            })
export class TaskStore extends BaseModelStore<Task> {
  constructor(taskService: TaskService) {
    super(taskService, Task.DBName);
  }
}
