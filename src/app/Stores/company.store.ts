import {Injectable} from '@angular/core';
import {Company} from '../Models';
import {CompanyService} from '../Services/Company.service';
import {BaseModelStore} from './base-model.store';

@Injectable({
              providedIn: 'root'
            })
export class CompanyStore extends BaseModelStore<Company> {
  constructor(companyService: CompanyService) {
    super(companyService, Company.DBName);
  }
}
