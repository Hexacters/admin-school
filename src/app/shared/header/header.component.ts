import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Output() toggleSide: EventEmitter<any> = new EventEmitter();

    constructor(private router: Router) { }

    ngOnInit() {
    }

    toggleSideBar() {
        this.toggleSide.emit();
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 200);

    };

    goToHome() {
        this.router.navigate(['/dashboard'])
    }

    logOut() {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login'])
    }

}
