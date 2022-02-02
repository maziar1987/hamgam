import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { PersonService } from 'src/app/basicinfo/person/services/person.service';
import { User } from '../models/user';
import { UserManagementService } from '../services/user-management.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent extends BaseComponent implements OnInit {

  isLoading = false;
  user: User;
  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userManagementService: UserManagementService,
    private personService: PersonService) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  get fullName() { return `${this.user.firstName} ${this.user.lastName}`; };

  loadData() {
    this.activatedRoute.paramMap.subscribe(p => {
      var id = +p.get('id');

      this.isLoading = true;
      this.userManagementService.getUser(id).subscribe(res => {
        this.user = res;

        if (!this.user) {
          this.warningNotify({ detail: 'اطلاعاتی وجود ندارد', summary: 'اخطار' });
          this.onBack();
        }

        this.personService.getPerson(id).subscribe(person => {
          this.user.person = person
        }, error => {
          this.handleError(error);
        });
      }, error => {
        this.handleError(error);
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
    });
  }

  handleError(error: any) {
    console.error(error);
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
  }

  onBack() {
    this.router.navigate(["../"], { relativeTo: this.activatedRoute });
  }

  onDelete() {
    this.accept_modal.show(this.user.login + ' حذف شود؟', this.user);
  }

  delete(rowData: User) {
    this.userManagementService.deleteUser(rowData.login).subscribe(res => {
      this.successNotify({ detail: 'عملیات حذف با موفقیت انجام شد', summary: 'عملیات موفق' });

      this.onBack();
    }, error => {
      this.handleError(error);
    });
  }

  onEdit() {
    this.router.navigate(["../edit", this.user.id], { relativeTo: this.activatedRoute });
  }

}
