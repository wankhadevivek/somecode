
import { NgModule } from '@angular/core';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MatSidenavModule } from '@angular/material';
import { EndUserLayoutRoutingModule } from './enduserlayout-routing.module';
import { EndUserLayoutComponent } from './enduserlayout.component';
import {MatCheckboxModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatNativeDateModule, MatRippleModule, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatSliderModule} from '@angular/material/slider';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DatepickerModule} from "ngx-bootstrap";
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {DataTableModule} from "angular-6-datatable";
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { HighchartsChartModule } from 'highcharts-angular';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CusOnlineBookComponent } from '../cusonlinebook/cusonlinebook.component';
import { CusloginComponent } from '../cuslogin/cuslogin.component';
import { CusOnlineRegisterComponent } from '../cusonlineregister/cusonlineregister.component';
import { CusOnlineServicesComponent } from '../cusonlineservices/cusonlineservices.component';
import { CusprofileComponent } from '../cusprofile/cusprofile.component';
import { SpinendComponent } from '../../shared/spinnerend/spinend/spinend.component';
import { TranslateModule } from '@ngx-translate/core'
import { NgSelectModule } from "@ng-select/ng-select";
import { SearchPipe } from 'src/app/shared/pipe/search.pipe';
import { ReadmorePipe } from 'src/app/shared/pipe/readmore.pipe';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { GaragefinderComponent } from '../Finder/garagefinder/garagefinder.component';

@NgModule({
  declarations: [
    EndUserLayoutComponent,
    CusOnlineBookComponent,
    CusloginComponent,
    CusprofileComponent,
    CusOnlineRegisterComponent,
    CusOnlineServicesComponent,
    SpinendComponent,
    GaragefinderComponent,
    SearchPipe,
    ReadmorePipe
  ],
  exports: [MatSidenavModule,SpinendComponent],
  imports: [
    GooglePlaceModule,
    SatDatepickerModule,
    SatNativeDateModule,
    FormsModule,
    HighchartsChartModule,
    DataTableModule,
    RoundProgressModule,
    NgMultiSelectDropDownModule,
    AutocompleteLibModule,
    NgxMaterialTimepickerModule,
    EndUserLayoutRoutingModule,
    NgbPaginationModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    Ng2SearchPipeModule,
    NgbAlertModule,
    MatSidenavModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    NgSelectModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    TranslateModule
  ],
  providers: [DecimalPipe,{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
  bootstrap: []
})
export class EndUserLayoutModule { }
