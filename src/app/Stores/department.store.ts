import {Injectable} from '@angular/core';
import {Department} from '../Models';
import {DepartmentService} from '../Services/Department.service';
import {BaseModelStore} from './base-model.store';

@Injectable({
              providedIn: 'root'
            })
export class DepartmentStore extends BaseModelStore<Department> {
  constructor(departmentService: DepartmentService) {
    super(departmentService, Department.DBName);
  }
}
