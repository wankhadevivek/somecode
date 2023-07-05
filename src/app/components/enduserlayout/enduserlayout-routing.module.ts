import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EndUserLayoutComponent } from './enduserlayout.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { CusloginComponent } from '../cuslogin/cuslogin.component';
import { CusOnlineServicesComponent } from '../cusonlineservices/cusonlineservices.component';
import { CusOnlineBookComponent } from '../cusonlinebook/cusonlinebook.component';
import { CusOnlineRegisterComponent } from '../cusonlineregister/cusonlineregister.component';
import { CusprofileComponent } from '../cusprofile/cusprofile.component';
import { GaragefinderComponent } from '../Finder/garagefinder/garagefinder.component';
const routes: Routes = [
  { path: '', component: EndUserLayoutComponent,
    children:[
      {path: 'cus/:id', component: CusloginComponent},// Customer home page
      {path: 'cus/:id/register', component: CusOnlineRegisterComponent},// Customer all booking page
      {path: 'cus/:id/services', component: CusOnlineServicesComponent},// Customer servives page
      {path: 'cus/:id/book', component: CusOnlineBookComponent},// Customer book the appoitmet page
      {path: 'cus/:id/profile', component: CusprofileComponent},// Customer profile page
    ]
  },
  {
    path: 'finder', component: GaragefinderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]
})
export class EndUserLayoutRoutingModule { }
