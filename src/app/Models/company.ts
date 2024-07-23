import {Base, Department} from '../Models';

export class Company extends Base {
  public Logo: string;
  public Color: string;
  public Departments: Department[] = [];
}
