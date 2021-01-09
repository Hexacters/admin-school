import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainCompComponent } from './main-comp/main-comp.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CategoryComponent } from './modules/category/category.component';
import { SubcategoryComponent } from './modules/subcategory/subcategory.component';
import { DailogComponent } from './modules/dailog/dailog.component';

import { MatButtonModule} from '@angular/material/button';
import { MatListModule} from '@angular/material/list';
import { MatCardModule} from '@angular/material/card';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatDividerModule} from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatPaginatorModule} from '@angular/material/paginator';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule} from '@angular/material/dialog';
import { MatSelectModule} from '@angular/material/select';
import { SubsubCategoryComponent } from './modules/subsub-category/subsub-category.component';
import { AddDepartmentComponent } from './modules/department/add-department/add-department.component';
import { ViewDepartmentComponent } from './modules/department/view-department/view-department.component';
import { AddDivisionComponent } from './modules/division/add-division/add-division.component';
import { ViewDivisionComponent } from './modules/division/view-division/view-division.component';
import { AddFeeComponent } from './modules/fees/add-fee/add-fee.component';
import { ViewFeeComponent } from './modules/fees/view-fee/view-fee.component';
import { AddProgrammeComponent } from './modules/programme/add-programme/add-programme.component';
import { ViewProgrammeComponent } from './modules/programme/view-programme/view-programme.component';
import { SchoolComponent } from './modules/school/Addschool/school.component';
import { ViewschoolComponent } from './modules/school/viewschool/viewschool.component';
import { AddSemComponent } from './modules/semester/add-sem/add-sem.component';
import { ViewSemComponent } from './modules/semester/view-sem/view-sem.component';
import { SmDrawerComponent } from './shared/sm-drawer/sm-drawer.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './shared/login/login.component';
import { AppSetting } from './core/app.setting';
import { AuthGuard } from './core/auth.guard';
import { HeaderInterceptor } from './core/HeaderInterceptor';
import { FeeTypeComponent } from './modules/Type/fee-type/fee-type.component';
import { FeeTypeviewComponent } from './modules/Type/fee-typeview/fee-typeview.component';
import { UtilityServiceService } from './utility-service.service';
import { LocalcommunicationService } from './core/localcommunication.service';
import { ActivateFeeComponent } from './modules/Organize/activate-fee/activate-fee.component';
import { AddScolarshipComponent } from './modules/Organize/add-scolarship/add-scolarship.component';
import { ApproveScolarshipComponent } from './modules/Organize/approve-scolarship/approve-scolarship.component';
import { PenaltyComponent } from './modules/Organize/penalty/penalty.component';
import { OnlineFeeComponent } from './modules/Organize/online-fee/online-fee.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AppComponent,
    MainCompComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    CategoryComponent,
    SubcategoryComponent,
    DailogComponent,
    SubsubCategoryComponent,
    SchoolComponent,
    ViewschoolComponent,
    AddDepartmentComponent,
    ViewDepartmentComponent,
    AddProgrammeComponent,
    ViewProgrammeComponent,
    AddSemComponent,
    ViewSemComponent,
    AddDivisionComponent,
    ViewDivisionComponent,
    AddFeeComponent,
    ViewFeeComponent,
    SmDrawerComponent,
    DashboardComponent,
    LoginComponent,
    FeeTypeComponent,
    FeeTypeviewComponent,
    ActivateFeeComponent,
    AddScolarshipComponent,
    ApproveScolarshipComponent,
    PenaltyComponent,
    OnlineFeeComponent
  ],
  entryComponents:[DailogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatExpansionModule,
    MatTableModule,
    MatSidenavModule,
    MatPaginatorModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule
  ],
  providers: [
    AppSetting,
    UtilityServiceService,
    LocalcommunicationService,
        AuthGuard,
        // DatePipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor,
            multi: true
        },
        // {
        //     provide: DateAdapter,
        //     useClass: AppDateFormatAdapter
        // },
        // {
        //     provide: MAT_DATE_FORMATS,
        //     useValue: APP_DATE_FORMATS
        // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
