import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    userName = '';
    password = '';
    constructor(private _router: Router, private _loginData: UtilityServiceService) { }

    ngOnInit() {
    }

    login() {
        this._loginData.getLogin(this.userName, this.password).subscribe(res => {
            localStorage.setItem('userDetails', JSON.stringify(res));
            this._router.navigate(['/dashboard'])
        })

    }

}
