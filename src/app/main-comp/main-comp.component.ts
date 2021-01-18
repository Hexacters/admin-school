import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main-comp',
    templateUrl: './main-comp.component.html',
    styleUrls: ['./main-comp.component.scss']
})
export class MainCompComponent implements OnInit {

    sideBarToggle: boolean = true;
    isLoggedIn: boolean = true;
    constructor(private router: Router) { }

    ngOnInit() {
        const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
        if (!userDetails.token) {
            this.router.navigate(['/login']);
        } else {
            if (this.router.url == '/')
                this.router.navigate(['/dashboard']);
        }

    }
    toggleSide(event) {
        this.sideBarToggle = !this.sideBarToggle;
    }

}
