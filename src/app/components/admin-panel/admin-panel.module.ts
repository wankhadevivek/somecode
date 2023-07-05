import { NgModule } from "@angular/core";
import { AdminLoginComponent } from "./admin-login/admin-login.component";
import { AdminDataFileComponent } from "./admin-data-file/admin-data-file.component";
import { AdminPanelRoutingModule } from "./admin-panel-routing.module";
import { AdminPanelComponent } from "./admin-panel.component";


import { TranslateModule } from '@ngx-translate/core'
import { NgSelectModule } from "@ng-select/ng-select";
import { SearchPipe } from 'src/app/shared/pipe/search.pipe';
import { ReadmorePipe } from 'src/app/shared/pipe/readmore.pipe';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AdminHomeComponent } from "./admin-home/admin-home.component";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";

import { MatTabsModule } from "@angular/material/tabs";
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatNativeDateModule} from '@angular/material'
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatBadgeModule } from "@angular/material/badge";
import {MatButtonModule} from '@angular/material/button';
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { AuthGuard } from "./auth-guard.service";
import { AuthService } from "./auth-service";


@NgModule({
    declarations:[
     AdminPanelComponent,
        AdminLoginComponent,
        AdminHomeComponent,
        AdminDataFileComponent
  
    ],
    exports:[
        AdminLoginComponent,
        AdminDataFileComponent,
        MatCardModule,

        
        MatListModule,

        MatFormFieldModule,
        MatSelectModule,
        MatDividerModule,
        MatSliderModule,
        MatTabsModule,
        MatBadgeModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule

    ],
    imports:[AdminPanelRoutingModule,
            TranslateModule, 
            CommonModule,
            FormsModule,
            AutocompleteLibModule,
            MatCardModule,
        
            MatListModule,
    
            MatFormFieldModule,
            MatSelectModule,
            MatDividerModule,
            MatSliderModule,
            MatTabsModule,
            MatBadgeModule,

            MatButtonModule,
            
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule

           ],
    providers:[AuthGuard, AuthService]

})
export class AdminPanelModule{

}