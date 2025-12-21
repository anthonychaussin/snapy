import {Injectable} from '@angular/core';
import {Project} from '../Models';
import {ProjectService} from '../Services/Project.service';
import {BaseModelStore} from './base-model.store';

@Injectable({
              providedIn: 'root'
            })
export class ProjectStore extends BaseModelStore<Project> {
  constructor(projectService: ProjectService) {
    super(projectService, Project.DBName);
  }
}
