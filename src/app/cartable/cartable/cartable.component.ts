import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { UserService } from 'src/app/user/user.service';
import { FolderService } from '../services/folder.service';

@Component({
  selector: 'app-cartable',
  templateUrl: './cartable.component.html',
  styleUrls: ['./cartable.component.scss']
})
export class CartableComponent implements OnInit {

  folderId: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private folderService: FolderService,
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(res => this.userService.curUser = res);
    this.userService.getAllUser(<Pagination>{page:0,size:100000,sort:["login,asc"]}).subscribe(res => this.userService.allUsers = res);
  }

}
