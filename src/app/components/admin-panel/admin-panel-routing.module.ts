import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDataFileComponent } from './admin-data-file/admin-data-file.component';
import { AdminPanelComponent } from './admin-panel.component';
import { AuthGuard } from './auth-guard.service';
const routes: Routes = [
  { path: '', component: AdminPanelComponent,
    children:[
      {path: 'admin', component: AdminLoginComponent},
      {path: 'admin-home',canActivate:[AuthGuard], component: AdminHomeComponent},
      {path: 'admin-data-file',canActivate:[AuthGuard], component: AdminDataFileComponent},
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [

  ]
})
export class AdminPanelRoutingModule { }
