import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  oldPassword = '';
  newPassword = '';
  newPassword2 = '';
  public editData: object = {};
  public selectedFeeType = {};

  constructor(
    private changePass: UtilityServiceService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

  }

  onSubmit() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
    if (this.newPassword == this.newPassword2) {

      const obj = {
        currentPassword: this.oldPassword,
        newPassword: this.newPassword,
        id: userDetails.id
      }
      this.changePass.resetPassword(obj).subscribe(res => {
        this.toastr.success('Password updated', "Info");
        switch (userDetails.role) {
          case 'student':
            this.router.navigate(['/profile']);
            return;
          case 'admin':
            this.router.navigate(['/dashboard']);
            return;
        }
      }, (res: HttpErrorResponse) => {
        this.toastr.error(res.error.message || res.message, 'Info');
      });
    }
    else {
      this.toastr.error('Passwords Not Matched', "Info");
    }
  }
}
