import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MessageService } from 'primeng/api';
import { AuthenticateGuard } from './account/authenticate.guard';
import { AppErrorModule } from './app-error/app-error.module';
import { AppRoutingModule } from './app-routing.module';
import { AppSharedModule } from './app-shared/app-shared.module';
import { AppComponent } from './app.component';
import { RequestInterceptor } from './request.interceptor';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient) => new TranslateHttpLoader(http, 'assets/i18n/', '.json'),
                deps: [HttpClient]
            },
            extend: true,
            isolate: false,
            defaultLanguage: 'fa'
        }),

        AppSharedModule,
        AppErrorModule,
        AppRoutingModule
    ],
    providers: [
        MessageService,
        AuthenticateGuard,
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }],
    exports: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
