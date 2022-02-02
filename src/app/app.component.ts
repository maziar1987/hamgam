import { Component } from '@angular/core';
import { BaseComponent } from './app-shared/base/base.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {

  constructor() {
    super();
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('fa');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('fa');
  }

  ngOnInit(): void { }

}
