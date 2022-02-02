import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { BasicValueType } from '../../basic-value/basic-value.model';
import { BasicValueService } from '../../basic-value/basic-value.service';
import { Person } from '../models/person';
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.scss']
})
export class PersonDetailComponent extends BaseComponent implements OnInit {

  person: Person;
  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: PersonService,
    private basicValueService: BasicValueService) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe(p => {
      var id = +p.get('id');

      this.service.getPerson(id).subscribe(res => {
        this.person = res;

        if (!this.person) {
          this.warningNotify({ detail: 'اطلاعاتی وجود ندارد', summary: 'اخطار' });
          this.onBack();
        }
        this.basicValueService.getBasicInfo(BasicValueType.educationDegree).subscribe(educationDegree => {
          this.person.educationDegree = educationDegree.children.find(x => x.id === this.person.educationDegreeId);
        }, error => {
          this.handleError(error);
        });

        this.basicValueService.getBasicInfo(BasicValueType.rank).subscribe(rank => {
          this.person.rank = rank.children.find(x => x.id === this.person.rankId);
        }, error => {
          this.handleError(error);
        });

        this.basicValueService.getBasicInfo(BasicValueType.studyField).subscribe(studyField => {
          this.person.studyField = studyField.children.find(x => x.id === this.person.studyFieldId);
        }, error => {
          this.handleError(error);
        });

      }, error => {
        this.handleError(error);
      });
    });
  }

  handleError(error: any) {
    console.error(error);
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
  }

  onBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  onDelete() {
    this.accept_modal.show(this.person.firstName + ' ' + this.person.lastName + ' حذف شود؟', this.person);
  }

  delete(rowData) {
    this.service.deletePerson(rowData.id).subscribe(res => {
      this.successNotify({ detail: 'عملیات حذف با موفقیت انجام شد', summary: 'عملیات موفق' });

      this.onBack();
    }, error => {
      this.handleError(error);
    });
  }

  onEdit() {
    this.router.navigate(['../edit', this.person.id], { relativeTo: this.activatedRoute });
  }

}
