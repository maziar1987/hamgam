import { Component, Injector, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  @Input() loading: boolean = false;
  @Input() text: string = '';

  constructor(private injector: Injector) {
    var translate = injector.get(TranslateService);
    translate.get('message.waiting').subscribe(trans => { this.text = trans; });
  }

}
