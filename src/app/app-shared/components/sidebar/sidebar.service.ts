import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService extends BaseService {

  private toggled = false;

  constructor(private http: HttpClient) {
    super();
  }

  get sidebarState() {
    return this.toggled;
  }

  set sidebarState(state: boolean) {
    this.toggled = state;
  }

  toggle() {
    this.toggled = !this.toggled;
  }

}
