import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { ExpertWorkingGroupService } from 'src/app/expert-working-group/services';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { AuthService } from '../auth.service';
import { Login } from './login.model';
import { LoginService } from './login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(
    private service: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private workingGroupService: ExpertWorkingGroupService,
    private authService: AuthService) {
    super();
  }

  ngOnInit(): void {
    this.translate.get('login').subscribe((res: any) => {
      console.log(res);
    });

    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(255)]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.warningNotify({ detail: "اطلاعات را به درستی وارد نمایید.", summary: "اخطار" });
      return;
    }

    var login = <Login>{
      username: this.form.controls.username.value,
      password: this.form.controls.password.value,
      rememberMe: this.form.controls.rememberMe.value
    };

    this.service.login(login).subscribe(res => {
      this.form.reset();
      // this.successNotify({ detail: "با موفقیت وارد شدید", summary: "عملیات موفق" });
      this.cookieService.set(this.authService.AUTHENTICATE_COOKIE_NAME, "true", { path: "/" });
      this.router.navigate(["/"]);
    }, error => {
      console.error(error);
      this.errorNotify({ detail: "ورود ناموفق", summary: "خطا" });
    });
  }

}
