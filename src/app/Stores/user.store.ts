import {Injectable} from '@angular/core';
import {User} from '../Models';
import {UserService} from '../Services/User.service';
import {BaseModelStore} from './base-model.store';

@Injectable({
              providedIn: 'root'
            })
export class UserStore extends BaseModelStore<User> {
  constructor(userService: UserService) {
    super(userService, User.DBName);
  }
}
