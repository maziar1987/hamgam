import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.scss']
})
export class GetUsersComponent implements OnInit {

  constructor(private service: UserService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) { }

  users: User[];
  selectedUsers: User[];

  ngOnInit(): void {

    this.service.getAllUser(<Pagination>{page:0,size:100000,sort:["login,asc"]}).subscribe(res => {
      this.users = res;
    }
    )
  }

  ok() {
    this.ref.close(this.selectedUsers);
  }

  cancel() {
    this.ref.close(null);
  }

}
