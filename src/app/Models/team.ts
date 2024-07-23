import {Base, Project, User} from '../Models';

export class Team extends Base {
  public Users: User[] = [];
  public Projects: Project[] = [];
}
