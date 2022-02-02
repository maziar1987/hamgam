import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PanelMenuModule } from 'primeng';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { NationalCodeDirective } from '../form-container/validators/national-code.directive';
import { AcceptComponent } from './components/accept/accept.component';
import { DatepickerBasicJalaliComponent } from './components/datepicker/datepicker-basic-jalali/datepicker-basic-jalali.component';
import { DatepickerPopupJalaliComponent } from './components/datepicker/datepicker-popup-jalali/datepicker-popup-jalali.component';
import { DatepickerPopupRangeComponent } from './components/datepicker/datepicker-popup-range/datepicker-popup-range.component';
import { DatepickerPopupComponent } from './components/datepicker/datepicker-popup/datepicker-popup.component';
import { DatepickerRangeJalaliComponent } from './components/datepicker/datepicker-range-jalali/datepicker-range-jalali.component';
import { DateFormatValidatorDirective } from './components/datepicker/directives/date-format-validator.directive';
import { FooterComponent } from './components/footer/footer.component';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { SidebarItemComponent } from './components/sidebar/sidebar-item/sidebar-item.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimepickerBasicComponent } from './components/timepicker-basic/timepicker-basic.component';
import { KeysPipe } from './pipes/keys.pipe';
import { persianDatePipe } from './pipes/persianDate.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { TimePipe } from './pipes/time.pipe';
import { LoggerService } from './services/logger.service';
import { SpinnerBorderComponent } from './components/spinner-border/spinner-border.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { NgbDatepickerModule } from './ng-bootstrap/datepicker/datepicker.module';

@NgModule({
  declarations: [
    TimePipe,
    SortPipe,
    KeysPipe,
    persianDatePipe,

    NationalCodeDirective,
    SidebarComponent,
    FooterComponent,
    NavMenuComponent,
    AcceptComponent,
    ImageViewerComponent,

    DatepickerPopupComponent,
    DatepickerPopupJalaliComponent,
    DatepickerPopupRangeComponent,
    TimepickerBasicComponent,
    DatepickerBasicJalaliComponent,
    DatepickerRangeJalaliComponent,
    SidebarItemComponent,
    LoaderComponent,
    DateFormatValidatorDirective,
    SpinnerBorderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgbDatepickerModule,
    NgbTimepickerModule,

    TranslateModule,
    DynamicDialogModule,
    ChartModule,
    ToolbarModule,
    PanelModule,
    ToggleButtonModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    TableModule,
    InputMaskModule,
    SplitButtonModule,
    ProgressSpinnerModule,
    MenuModule,
    TabMenuModule,
    CardModule,
    TooltipModule,
    PaginatorModule,
    ContextMenuModule,
    CheckboxModule,
    TabViewModule,
    InputTextareaModule,
    ConfirmDialogModule,
    MultiSelectModule,
    FileUploadModule,
    BreadcrumbModule,
    EditorModule,
    FullCalendarModule,
    InputMaskModule,
    DialogModule,
    MenubarModule,
    SelectButtonModule,
    RadioButtonModule,
    TreeTableModule,
    ListboxModule,
    DropdownModule,
    OrganizationChartModule,
    TreeModule,
    MessageModule,
    MessagesModule,
    PanelMenuModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgbDatepickerModule,
    NgbTimepickerModule,

    TranslateModule,
    DynamicDialogModule,
    ChartModule,
    ToolbarModule,
    PanelModule,
    ToggleButtonModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    TableModule,
    InputMaskModule,
    SplitButtonModule,
    MenuModule,
    TabMenuModule,
    CardModule,
    TooltipModule,
    PaginatorModule,
    ContextMenuModule,
    CheckboxModule,
    TabViewModule,
    InputTextareaModule,
    ConfirmDialogModule,
    MultiSelectModule,
    FileUploadModule,
    BreadcrumbModule,
    EditorModule,
    FullCalendarModule,
    InputMaskModule,
    DialogModule,
    MenubarModule,
    SelectButtonModule,
    RadioButtonModule,
    TreeTableModule,
    ListboxModule,
    DropdownModule,
    OrganizationChartModule,
    TreeModule,
    MessageModule,
    MessagesModule,

    SidebarComponent,
    FooterComponent,
    NavMenuComponent,
    AcceptComponent,
    TimePipe,
    SortPipe,
    ImageViewerComponent,
    DatepickerPopupComponent,
    DatepickerPopupJalaliComponent,
    DatepickerPopupRangeComponent,
    TimepickerBasicComponent,
    DatepickerBasicJalaliComponent,
    DatepickerRangeJalaliComponent,
    SidebarItemComponent,
    LoaderComponent,
    SpinnerBorderComponent,
    KeysPipe,
    persianDatePipe,
    NationalCodeDirective,
    ProgressSpinnerModule
  ],
  providers: [
    MessageService,
    LoggerService,
    DialogService,
    ConfirmationService,
    persianDatePipe,
  ]
})
export class AppSharedModule {
  static injector: Injector;

  constructor(injector: Injector) {
    AppSharedModule.injector = injector;
  }
}
