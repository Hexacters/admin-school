import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { MainCompComponent } from './main-comp/main-comp.component';
import { AdminComponent } from './modules/admin/admin.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AddDepartmentComponent } from './modules/department/add-department/add-department.component';
import { ViewDepartmentComponent } from './modules/department/view-department/view-department.component';
import { AddDivisionComponent } from './modules/division/add-division/add-division.component';
import { ViewDivisionComponent } from './modules/division/view-division/view-division.component';
import { AddFeeComponent } from './modules/fees/add-fee/add-fee.component';
import { ViewFeeComponent } from './modules/fees/view-fee/view-fee.component';
import { AddScolarshipComponent } from './modules/Organize/add-scolarship/add-scolarship.component';
import { ApproveScolarshipComponent } from './modules/Organize/approve-scolarship/approve-scolarship.component';
import { AssignScholarshipComponent } from './modules/Organize/assign/scholarship/scholarship.component';
import { OnlineFeeComponent } from './modules/Organize/online-fee/online-fee.component';
import { PenaltyComponent } from './modules/penalty/penalty.component';
import { ScholarshipComponent } from './modules/Organize/scholarship/scholarship.component';
import { AddPenaltyComponent } from './modules/penalty/add-penalty/add-penalty.component';
import { AddProgrammeComponent } from './modules/programme/add-programme/add-programme.component';
import { ViewProgrammeComponent } from './modules/programme/view-programme/view-programme.component';
import { SchoolComponent } from './modules/school/Addschool/school.component';
import { ViewschoolComponent } from './modules/school/viewschool/viewschool.component';
import { AddSemComponent } from './modules/semester/add-sem/add-sem.component';
import { ViewSemComponent } from './modules/semester/view-sem/view-sem.component';
import { AddStudentComponent } from './modules/students/add-student/add-student.component';
import { StudentsComponent } from './modules/students/students.component';
import { FeeTypeComponent } from './modules/Type/fee-type/fee-type.component';
import { FeeTypeviewComponent } from './modules/Type/fee-typeview/fee-typeview.component';
import { LoginComponent } from './shared/login/login.component';
import { OnlineComponent } from './modules/payment/online/online.component';
import { OfflineComponent } from './modules/payment/offline/offline.component';
import { AddAdminComponent } from './modules/admin/add-admin/add-admin.component';
import { FeeCalculationComponent } from './modules/payment/fee-calculation/fee-calculation.component';
import { ActiveFeeComponent } from './modules/active-fee/active-fee.component';
import { AddActiveFeeComponent } from './modules/active-fee/add-active-fee/add-active-fee.component';
import { UpdateFeeCalcComponent } from './modules/payment/fee-calculation/update-fee-calc/update-fee-calc.component';
import { ChangePasswordComponent } from './modules/common/change-password/change-password.component';
import { StudentProfileComponent } from './modules/student-module/student-profile/student-profile.component';
import { StudentPaymentComponent } from './modules/student-module/student-payment/student-payment.component';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  {
    path: "", component: MainCompComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: "profile", component: StudentProfileComponent },
      { path: "change-password", component: ChangePasswordComponent },

      { path: "dashboard", component: DashboardComponent },
      { path: "school/add", component: SchoolComponent },
      { path: "school/edit", component: SchoolComponent },
      { path: "school", component: ViewschoolComponent },
      { path: "department/add", component: AddDepartmentComponent },
      { path: "department/edit", component: AddDepartmentComponent },
      { path: "department/bySchool", component: ViewDepartmentComponent },
      { path: "department", component: ViewDepartmentComponent },
      { path: "programm/add", component: AddProgrammeComponent },
      { path: "programm/edit", component: AddProgrammeComponent },
      { path: "programm", component: ViewProgrammeComponent },
      { path: "programm/byDepartment", component: ViewProgrammeComponent },
      { path: "semester/add", component: AddSemComponent },
      { path: "semester/edit", component: AddSemComponent },
      { path: "semester", component: ViewSemComponent },
      { path: "semester/byProgramm", component: ViewSemComponent },
      { path: "division/add", component: AddDivisionComponent },
      { path: "division/edit", component: AddDivisionComponent },
      { path: "division", component: ViewDivisionComponent },
      { path: "division/bySemester", component: ViewDivisionComponent },
      { path: "feeType/add", component: FeeTypeComponent },
      { path: "feeType/edit", component: FeeTypeComponent },
      { path: "feeType", component: FeeTypeviewComponent },
      { path: "fee/add", component: AddFeeComponent },
      { path: "fee/edit", component: AddFeeComponent },
      { path: "fee", component: ViewFeeComponent },

      { path: "active-fee", component: ActiveFeeComponent },
      { path: "active-fee/add", component: AddActiveFeeComponent },
      { path: "active-fee/edit", component: AddActiveFeeComponent },

      { path: "scholarship/add", component: AddScolarshipComponent },
      { path: "scholarship/edit", component: AddScolarshipComponent },
      { path: "scholarship", component: ScholarshipComponent },

      { path: "assign", component: AssignScholarshipComponent },
      { path: "assign/scholarship", component: ApproveScolarshipComponent },
      { path: "assign/scholarship/edit", component: ApproveScolarshipComponent },

      { path: "students/edit", component: AddStudentComponent },
      { path: "students/add", component: AddStudentComponent },
      { path: "students", component: StudentsComponent },
      { path: "students/byDivision", component: StudentsComponent },

      { path: "students/payment", component: StudentPaymentComponent },

      { path: "penalty", component: PenaltyComponent },
      { path: "penalty/add", component: AddPenaltyComponent },
      { path: "penalty/edit", component: AddPenaltyComponent },

      { path: "admin", component: AdminComponent },
      { path: "admin/add", component: AddAdminComponent },
      { path: "admin/edit", component: AddAdminComponent },

      { path: "payment/online", component: OnlineComponent },
      { path: "payment/offline", component: OfflineComponent },
      { path: "fee-calculation", component: FeeCalculationComponent },
      { path: "fee-calculation/update", component: UpdateFeeCalcComponent },
      { path: "fee-calculation/view", component: UpdateFeeCalcComponent },

      { path: "organize/Penalty", component: PenaltyComponent },
      { path: "organize/OfflineFee", component: OnlineFeeComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
})
export class AppRoutingModule { }
