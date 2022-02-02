import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private msgService: MessageService,
    private injector: Injector) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request.clone({
      withCredentials: true
    })).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          if (error.status === 401) {
            if (!request.url.endsWith('/auth/login'))
              this.router.navigate(['/account/login']);
          }
          // else if (error.status === 400) {
          //   console.log('error')
          //   if (error.error.fieldErrors && error.error.fieldErrors.length > 0) {
          //     const translate = this.injector.get(TranslateService);
          //     const title = translate.instant('error.' + error.error.title);
          //     const msg: Message[] = [];
          //     error.error.fieldErrors.forEach(err => {
          //       const validateMsg = translate.instant(`validation.${err.message}`);
          //       const field = translate.instant(`${err.objectName}.${err.field}`);
          //       msg.push({ severity: 'warn', summary: title, detail: `${field} ${validateMsg}`});
          //     });

          //     if (msg.length > 0) {
          //       console.log('this.msgService.addAll')
          //       this.msgService.addAll(msg);
          //       return of(null);
          //     }
          //   }
          // }
          else if (error.status === 403) {
            this.msgService.add({ severity: 'warn', summary: 'عدم دسترسی', detail: 'دسترسی انجام این عملیات را ندارید' });

          }

        }

        return throwError(error);
      }));
  }

}
