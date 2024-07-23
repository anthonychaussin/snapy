import {Base, Project, Team} from '../Models';

export class Department extends Base {
  public Teams: Team[] = [];
  public Projects: Project[] = [];
}
