import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main-comp',
    templateUrl: './main-comp.component.html',
    styleUrls: ['./main-comp.component.scss']
})
export class MainCompComponent implements AfterViewInit {

    sideBarToggle: boolean = true;
    isLoggedIn: boolean = true;
    constructor(private router: Router) { }

    ngAfterViewInit() {
        const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
        if (!userDetails.token) {
            this.router.navigate(['/login']);
        } else {
            if (this.router.url == '/') {
                switch(userDetails.role) {
                    case 'student':
                        this.router.navigate(['/profile']);
                        return;
                    case 'admin':
                        this.router.navigate(['/dashboard']);
                        return;
                }
            }
        }
    }

    toggleSide(event) {
        this.sideBarToggle = !this.sideBarToggle;
    }

}
