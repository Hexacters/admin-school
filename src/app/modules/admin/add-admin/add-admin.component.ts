import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {

  penaltyForm: FormGroup;
  adminList: Array<any> = [];
  editFlag: boolean = false;
  editData: object = {};
  frequency = [{ 'name': 'Weekly' }, { 'name': 'Monthly' }, { 'name': 'Quartly' }, { 'name': 'Half Yearly' }, { 'name': 'Yearly' }]

  constructor(
      private _dataService: UtilityServiceService,
      private router: Router,
      private toastr: ToastrService
  ) {

  }

  ngOnInit() {
      this.penaltyForm = new FormGroup({
          'admin': new FormArray([])
      });

      if (this.router.url.includes('edit')) {
          this.editFlag = true;
          this.editData = JSON.parse(sessionStorage.getItem('admin'));
          this.onAdd(this.editData);
      } else {
          this.onAdd();
      }
  }

  public getPenalty(data) {
      return new FormGroup({
          'username': new FormControl(data['username'] || '', Validators.required),
          'password': new FormControl(data['emailId'] || '', Validators.required),
          'emailId': new FormControl(data['emailId'] || '', Validators.required),
          'phoneNo': new FormControl(data['phoneNo'] || '', Validators.required),
          'role': new FormControl('admin', Validators.required),
      })
  }

  public onAdd(data = {}) {
      this.adminList.push(data);
      (<FormArray>this.penaltyForm.get('admin')).push(this.getPenalty(data));
  }

  onSubmit() {
      const penalityForm = this.penaltyForm.value;
      this._dataService.saveAdmin(penalityForm.admin).subscribe(res => {
          this.router.navigate(['/admin']);
          this.toastr.success('Penalty details saved successfully', 'Info');
      }, (res: HttpErrorResponse) => {
          this.toastr.error(res.error.message || res.message, 'Info');
      });
  }

  ngOnDestroy() {
      sessionStorage.clear();
  }

  onUpdate() {
      const penalityForm = this.penaltyForm.value;
      delete penalityForm.admin[0].password;
      this._dataService.updateAdmin(this.editData['id'], penalityForm.admin[0]).subscribe(res => {
          this.router.navigate(['/admin']);
          this.toastr.success('Penalty details updated successfully', 'Info');
      }, (res: HttpErrorResponse) => {
          this.toastr.error(res.error.message || res.message, 'Info');
      });
  }

}
