import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    userName = '';
    password = '';
    constructor(
        private _router: Router,
        private _loginData: UtilityServiceService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

    login() {
        this._loginData.getLogin(this.userName, this.password).subscribe(res => {
            localStorage.setItem('userDetails', JSON.stringify(res));
            switch(res.role) {
                case 'student':
                    this._router.navigate(['/profile']);
                    return;
                case 'admin':
                    this._router.navigate(['/dashboard']);
                    return;
            }
            this._router.navigate(['/dashboard'])
        }, (res: HttpErrorResponse) => {
            this.toastr.error(res.error.message || res.message, 'Info');
        });
    }

}
