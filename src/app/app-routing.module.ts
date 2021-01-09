import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { MainCompComponent } from './main-comp/main-comp.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AddDepartmentComponent } from './modules/department/add-department/add-department.component';
import { ViewDepartmentComponent } from './modules/department/view-department/view-department.component';
import { AddDivisionComponent } from './modules/division/add-division/add-division.component';
import { ViewDivisionComponent } from './modules/division/view-division/view-division.component';
import { AddFeeComponent } from './modules/fees/add-fee/add-fee.component';
import { ViewFeeComponent } from './modules/fees/view-fee/view-fee.component';
import { ActivateFeeComponent } from './modules/Organize/activate-fee/activate-fee.component';
import { AddScolarshipComponent } from './modules/Organize/add-scolarship/add-scolarship.component';
import { ApproveScolarshipComponent } from './modules/Organize/approve-scolarship/approve-scolarship.component';
import { OnlineFeeComponent } from './modules/Organize/online-fee/online-fee.component';
import { PenaltyComponent } from './modules/Organize/penalty/penalty.component';
import { AddProgrammeComponent } from './modules/programme/add-programme/add-programme.component';
import { ViewProgrammeComponent } from './modules/programme/view-programme/view-programme.component';
import { SchoolComponent } from './modules/school/Addschool/school.component';
import { ViewschoolComponent } from './modules/school/viewschool/viewschool.component';
import { AddSemComponent } from './modules/semester/add-sem/add-sem.component';
import { ViewSemComponent } from './modules/semester/view-sem/view-sem.component';
import { FeeTypeComponent } from './modules/Type/fee-type/fee-type.component';
import { FeeTypeviewComponent } from './modules/Type/fee-typeview/fee-typeview.component';
import { LoginComponent } from './shared/login/login.component';


const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "", component: MainCompComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "school/add", component: SchoolComponent },
      { path: "school/edit", component: SchoolComponent },
      { path: "school/view", component: ViewschoolComponent },
      { path: "department/add", component: AddDepartmentComponent },
      { path: "department/edit", component: AddDepartmentComponent },
      { path: "department/view", component: ViewDepartmentComponent },
      { path: "programm/add", component: AddProgrammeComponent },
      { path: "programm/edit", component: AddProgrammeComponent },
      { path: "programm/view", component: ViewProgrammeComponent },
      { path: "semester/add", component: AddSemComponent },
      { path: "semester/edit", component: AddSemComponent },
      { path: "semester/view", component: ViewSemComponent },
      { path: "division/add", component: AddDivisionComponent },
      { path: "division/edit", component: AddDivisionComponent },
      { path: "division/view", component: ViewDivisionComponent },
      { path: "feeType/add", component: FeeTypeComponent },
      { path: "feeType/edit", component: FeeTypeComponent },
      { path: "feeType/view", component: FeeTypeviewComponent },
      { path: "fee/add", component: AddFeeComponent },
      { path: "fee/edit", component: AddFeeComponent },
      { path: "fee/view", component: ViewFeeComponent },
      { path: "organize/ActivateFee", component: ActivateFeeComponent },
      { path: "organize/addScholarship", component: AddScolarshipComponent },
      { path: "organize/approveSholarship", component: ApproveScolarshipComponent },
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
