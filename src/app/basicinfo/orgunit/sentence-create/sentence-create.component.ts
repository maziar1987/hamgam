import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { PersonExtended } from '../person.model';
import { PersonService } from '../person.service';
import { SentenceCreate } from '../sentence.model';
import { SentenceService } from '../sentence.service';

@Component({
  selector: 'app-sentence-create',
  templateUrl: './sentence-create.component.html',
  styleUrls: ['./sentence-create.component.scss']
})
export class SentenceCreateComponent extends BaseComponent implements OnInit {
  postid: number;
  persons: PersonExtended[];
  sentence: SentenceCreate;
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private sentenceservice: SentenceService,
    private pesonservice: PersonService,
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  ngOnInit(): void {
    this.postid = this.config.data.id;
    this.form = this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', Validators.required],
      paperDate: ['', Validators.required],
      paperNumber: ['', Validators.required],
      personId: ['', Validators.required],
      postId: [''],
    });
    this.loadData();
  }
  loadData() {
    this.pesonservice.getAll().subscribe(res => {
      if (res) {
        this.persons = res.map(x => this.pesonservice.extendUser(x));
      }
    }, error => {
      this.handleError(error);
    });
  }

  onSubmit(orgunitData) {
    if (this.form.valid) {
      this.sentence = <SentenceCreate>{};
      orgunitData.postId = this.postid;
      orgunitData.personId = orgunitData.personId.id;
      this.sentence = orgunitData;
      this.sentenceservice.create(this.sentence).subscribe(res => {

        // this.orgservice.selectedNode.children.push(
        //   <TreeNode>{
        //     label: this.orgunit.displayName, data: this.orgunit, leaf: false, parent: this.orgservice.selectedNode
        //   });;

        this.form.reset();
        // this.notifySuccess("با موفقیت ثبت شد","عملیات موفق")
       // this.messageService.add({ key: 'tl', severity: 'success', summary: "عملیات موفق", detail: "با موفقیت ثبت شد" });
        var person;
        this.persons.forEach(element => {
          if (element.id == orgunitData.personId) {
            person = element;
            return;
          }
        });
        this.ref.close(person);
      }, error => {
        // this.notifyWarn( error.error.error.message + "\r\n" + error.error.error.details,"اخطار")
      //  this.messageService.add({ key: 'tl', severity: 'warn', summary: "اخطار", detail: error.error.error.message + "\r\n" + error.error.error.details });
      });
    } else {
      // this.notifyWarn( "اطلاعات را به درستی وارد نمایید.","اخطار")
     // this.messageService.add({ key: 'tl', severity: 'warn', summary: "اخطار", detail: "اطلاعات را به درستی وارد نمایید." });
    }

  }

  handleError(error: any) {
    throw new Error("Method not implemented.");
  }

}
