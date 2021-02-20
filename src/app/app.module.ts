import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainCompComponent } from './main-comp/main-comp.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DailogComponent } from './modules/dailog/dailog.component';

import { MatTabsModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
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
import { AddScolarshipComponent } from './modules/Organize/add-scolarship/add-scolarship.component';
import { ApproveScolarshipComponent } from './modules/Organize/approve-scolarship/approve-scolarship.component';
import { PenaltyComponent } from './modules/penalty/penalty.component';
import { OnlineFeeComponent } from './modules/Organize/online-fee/online-fee.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AvatarModule } from 'ngx-avatar';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScholarshipComponent } from './modules/Organize/scholarship/scholarship.component';
import { StudentsComponent } from './modules/students/students.component';
import { AddStudentComponent } from './modules/students/add-student/add-student.component';
import { CommingSoonComponent } from './shared/comming-soon/comming-soon.component';
import { AdminComponent } from './modules/admin/admin.component';
import { AssignScholarshipComponent } from './modules/Organize/assign/scholarship/scholarship.component';
import { AddPenaltyComponent } from './modules/penalty/add-penalty/add-penalty.component';
import { OnlineComponent } from './modules/payment/online/online.component';
import { OfflineComponent } from './modules/payment/offline/offline.component';
import { AddAdminComponent } from './modules/admin/add-admin/add-admin.component';
import { FeeCalculationComponent } from './modules/payment/fee-calculation/fee-calculation.component';
import { ActiveFeeComponent } from './modules/active-fee/active-fee.component';
import { AddActiveFeeComponent } from './modules/active-fee/add-active-fee/add-active-fee.component';
import { UpdateFeeCalcComponent } from './modules/payment/fee-calculation/update-fee-calc/update-fee-calc.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeeStatusComponent } from './modules/payment/fee-calculation/modal/fee-status/fee-status.component';
import { ScholarshipStatusComponent } from './modules/payment/fee-calculation/modal/scholarship-status/scholarship-status.component';
import { ActiveFeeModalComponent } from './modules/active-fee/modal/active-fee-modal/active-fee-modal.component';
import { StudentStatusComponent } from './modules/dailog/student-status/student-status.component';
import { StudentProfileComponent } from './modules/student-module/student-profile/student-profile.component';
import { ChangePasswordComponent } from './modules/common/change-password/change-password.component';
import { PaymentStatusComponent } from './modules/common/payment-status/payment-status.component';
import { StudentPaymentComponent } from './modules/student-module/student-payment/student-payment.component';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { UniversityComponent } from './modules/university/university.component';
import { AddUniversityComponent } from './modules/university/add-university/add-university.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatBadgeModule, MatCheckboxModule } from '@angular/material';
import { ReportsComponent } from './modules/reports/reports.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'

@NgModule({
    declarations: [
        AppComponent,
        ReportsComponent,
        MainCompComponent,
        HeaderComponent,
        SidebarComponent,
        FooterComponent,
        DailogComponent,
        ForgotPasswordComponent,
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
        AddScolarshipComponent,
        ApproveScolarshipComponent,
        PenaltyComponent,
        OnlineFeeComponent,
        ConfirmationDialogComponent,
        ScholarshipComponent,
        StudentsComponent,
        AddStudentComponent,
        CommingSoonComponent,
        AdminComponent,
        AssignScholarshipComponent,
        AddPenaltyComponent,
        OnlineComponent,
        OfflineComponent,
        AddAdminComponent,
        FeeCalculationComponent,
        ActiveFeeComponent,
        AddActiveFeeComponent,
        UpdateFeeCalcComponent,
        FeeStatusComponent,
        ScholarshipStatusComponent,
        ActiveFeeModalComponent,
        StudentStatusComponent,
        StudentProfileComponent,
        ChangePasswordComponent,
        PaymentStatusComponent,
        StudentPaymentComponent,
        UniversityComponent,
        AddUniversityComponent
    ],
    entryComponents: [
        DailogComponent,
        ConfirmationDialogComponent,
        FeeStatusComponent,
        ScholarshipStatusComponent,
        ActiveFeeModalComponent,
        StudentStatusComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        }),
        FormsModule,
        MatTabsModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatTreeModule,
        NgApexchartsModule,
        MatBadgeModule,
        ReactiveFormsModule,
        SatDatepickerModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatCheckboxModule,
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
        MatSlideToggleModule,
        AvatarModule
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
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
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
