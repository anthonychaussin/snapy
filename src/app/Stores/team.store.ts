import {Injectable} from '@angular/core';
import {Team} from '../Models';
import {TeamService} from '../Services/Team.service';
import {BaseModelStore} from './base-model.store';

@Injectable({
              providedIn: 'root'
            })
export class TeamStore extends BaseModelStore<Team> {
  constructor(teamService: TeamService) {
    super(teamService, Team.DBName);
  }
}
