import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Person } from 'src/app/basicinfo/person/models/person';
import { PersonService } from 'src/app/basicinfo/person/services/person.service';
import { PolicySet } from 'src/app/policy/models/policy.model';
import { PolicySetService } from 'src/app/policy/services/policy-set.service';
import { User } from '../models/user';
import { UserEditInput } from '../models/user-edit-input';
import { UserManagementService } from '../services/user-management.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent extends BaseComponent implements OnInit {

  isLoading = false;
  filter: boolean = true;
  editMode: boolean = false;
  user: User;
  displayPersonSearch: boolean = false;
  selectedPerson: Person;

  policySets: PolicySet[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userManagementService: UserManagementService,
    private personService: PersonService,
    private policySetService: PolicySetService) {
    super();
  }

  ngOnInit(): void {
    this.createForm();

    this.getPolicySets();
    this.loadData();

    if (this.editMode) {
      this.password.clearValidators();
      this.repeatPassword.clearValidators();
    }
  }

  getPolicySets() {
    this.policySetService.getPolicySets().subscribe(policies => {
      this.policySets = policies;
    }, error => {
      this.handleError(error);
    });
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe(p => {
      this.editMode = (this.activatedRoute.snapshot.url[0].path === "edit");
      if (this.editMode) {
        var id = +p.get('id');

        this.isLoading = true;
        this.userManagementService.getUser(id).subscribe(res => {
          this.user = res;

          if (!this.user) {
            this.warningNotify({ detail: 'اطلاعاتی وجود ندارد', summary: 'اخطار' });
            this.onBack();
          }

          this.updateForm();
        }, error => {
          this.handleError(error);
          this.isLoading = false;
        }, () => {
          this.isLoading = false;
        });
      }
    });
  }

  get fullName() { return `${this.firstName.value} ${this.lastName.value}` }

  get login() { return this.form.get('login') }
  get password() { return this.form.get('password') }
  get repeatPassword() { return this.form.get('repeatPassword') }
  get firstName() { return this.form.get('firstName') }
  get lastName() { return this.form.get('lastName') }
  get email() { return this.form.get('email') }
  get langKey() { return this.form.get('langKey') }
  get activated() { return this.form.get('activated') }
  get selectedPolicySets() { return this.form.get('selectedPolicySets') }
  get personId() { return this.form.get('personId') }

  createForm() {
    this.form = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.email]],
      langKey: ['fa'],
      activated: [true, [Validators.required]],
      selectedPolicySets: [null],
      personId: ['', [Validators.required]]
    }, {
      validator: [this.confirmPasswordValidator]
    });
  }

  confirmPasswordValidator(control: FormControl): any {
    let p = control.root.get('password');
    let pc = control.root.get('repeatPassword');
    if (p && pc) {
      if (p.value !== pc.value) {
        pc.setErrors(
          { "passwordMismatch": true }
        );
      }
      else {
        pc.setErrors(null);
      }
    }
    return null;
  }

  updateForm() {
    //get person from server
    if (this.user.personId) {
      this.personService.getPerson(this.user.personId).subscribe(person => {
        this.selectedPerson = person;
      }, error => {
        this.handleError(error);
      });

      this.personId.setValue(this.user.personId);
      this.lastName.setValue(this.user.lastName);
      this.firstName.setValue(this.user.firstName);
    }

    this.login.setValue(this.user.login);
    this.email.setValue(this.user.email);
    this.langKey.setValue(this.user.langKey);
    this.activated.setValue(this.user.activated);
    this.selectedPolicySets.setValue(this.user.policySets);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    var userTemp = <UserEditInput>{
      id: this.user?.id,
      personId: this.personId.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      login: this.login.value,
      password: this.password.value,

      email: this.email.value,
      langKey: this.langKey.value,
      activated: this.activated.value,
      policySets: this.selectedPolicySets.value
    };

    if (this.editMode) {
      //update
      this.userManagementService.put(userTemp).subscribe(res => {
        this.successNotify({ detail: 'بروزرسانی انجام شد', summary: 'عملیات موفق' });

        this.onBack();
      }, error => {
        this.handleError(error);
      });
    }
    else {
      //insert
      this.userManagementService.post(userTemp).subscribe(res => {
        this.successNotify({ detail: 'عملیات ثبت با موفقیت انجام شد', summary: 'عملیات موفق' });

        this.onBack();
      }, error => {
        this.handleError(error);
      });
    }
  }

  onBack() {
    if (this.editMode) {
      this.router.navigate(["../../"], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(["../"], { relativeTo: this.activatedRoute });
    }
  }

  handleError(error: any) {
    console.error(error);

    if (error.error.errorKey == 'userexists') {
      this.login.setErrors({ duplicated: true });
      this.errorNotify({ detail: 'نام کاربری تکراری است', summary: 'رخداد خطا' });
    }

    if (error.error.errorKey == "emailexists") {
      this.email.setErrors({ duplicated: true });
      this.errorNotify({ detail: 'ایمیل تکراری است', summary: 'رخداد خطا' });
    }
  }

  displayPerson() {
    this.displayPersonSearch = true;
  }

  selectPerson(person: Person) {
    this.selectedPerson = person;
    this.personId.setValue(person.id);
    this.firstName.setValue(person.firstName);
    this.lastName.setValue(person.lastName);
  }

}
