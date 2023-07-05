import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './shared/guard/auth-guard';
import { AuthGuardService } from "./services/auth-guard.service";
import { PaymnetsuccessComponent } from './components/paymnetsuccess/paymnetsuccess.component';
import { PaymnetfaliureComponent } from './components/paymnetfaliure/paymnetfaliure.component';
import { EndusersuccessComponent } from './components/endusersuccess/endusersuccess.component';
import { EnduserfailComponent } from './components/enduserfail/enduserfail.component';
import { PilotappComponent } from './components/pilotapp/pilotapp.component';
import { FestiveComponent } from './components/festive/festive.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { SupplierLoginComponent } from './components/supplier-login/supplier-login.component';
import { JobcardDetailComponent } from './components/jobcard-detail/jobcard-detail.component';
/**
 * In this file all the main routes are defined
 * there are three main routes
 * one is the login in web app, second is web app main dashboard
 * third is the end-user app
 * here end-user app and the web app is the parent and they ahve multiple childs
*/

  const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'onlinestore', component: PilotappComponent },
    { path: 'festival', component: FestiveComponent },
    { path: 'forget-pass', component: ForgetPasswordComponent },
    { path: '', component: LoginComponent },
    { path: '', loadChildren: './components/enduserlayout/enduserlayout.module#EndUserLayoutModule'},
    { path: 'success', component: PaymnetsuccessComponent, canActivate: [AuthGuard] },
    { path: 'fail', component: PaymnetfaliureComponent, canActivate: [AuthGuard] },
    { path: 'end-user-success', component: EndusersuccessComponent },
    { path: 'end-user-fail', component: EnduserfailComponent }, 
    { path: '', loadChildren: './components/sidelayout/sidelayout.module#SidelayoutModule', canActivate: [AuthGuard]  },
     { path: 'jobcard-detail', component: JobcardDetailComponent },
     { path: 'jobcard-detail/:id', component: JobcardDetailComponent },
    { path: 'login/supplier', component: SupplierLoginComponent },
    { path: '', loadChildren: './components/admin-panel/admin-panel.module#AdminPanelModule'}
    ]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
