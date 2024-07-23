import {Base, Task, User} from '../Models';

export class Snap extends Base {
  private userUuid: string;
  private taskUuid: string;

  public User: User;
  public DateTime: Date = new Date();
  public Task: Task;

}
