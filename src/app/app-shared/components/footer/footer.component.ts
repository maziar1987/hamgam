import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FooterCopyright } from './footer.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() copyright: FooterCopyright;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.get('app.owner').subscribe((res: any) => {
      this.copyright = ({ lable: res + ' ' + 1399 + '\u00A9', link: 'http://hamgamit.com/' } as FooterCopyright);
    });
  }

}
