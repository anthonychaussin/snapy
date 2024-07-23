import {Base, Task} from '../Models';

export class Project extends Base {
  public Task: Task[] = [];
}
