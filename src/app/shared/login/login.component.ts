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
            this._router.navigate(['/dashboard'])
        }, (res: HttpErrorResponse) => {
            this.toastr.error(res.error.message || res.message, 'Info');
        });

    }

}
