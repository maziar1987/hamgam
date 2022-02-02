import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateGuard } from './account/authenticate.guard';
import { PageNotFoundComponent } from './app-error/page-not-found/page-not-found.component';
import { MainLayoutComponent } from './main-layout/main-layout/main-layout.component';

const routes: Routes = [
  { path: '', canActivate: [AuthenticateGuard], component: MainLayoutComponent, loadChildren: () => import('./main-layout/main-layout.module').then(m => m.MainLayoutModule) },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
