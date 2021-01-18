import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppSetting } from './app.setting';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

    constructor(private router: Router, private environment: AppSetting) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        try {
            let object: any = {
                setHeaders: {
                    'content-type': 'application/json',
                },
                url: this.checkUrlByApi(req.url) + req.url
            }

            let accessToken = '';
            if (JSON.parse(localStorage.getItem('userDetails'))) {
                accessToken = JSON.parse(localStorage.getItem('userDetails')).token;
            }

            if (accessToken == undefined || accessToken == null) {
                console.log("Access Token Missing");
            } else {
                object.setHeaders.authorization = `Bearer ${accessToken}`;
            }

            let dummyrequest = req.clone(object);
            // this.loaderService.show();
            return next.handle(dummyrequest).pipe(tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // close loader
                }
            },
            (err: HttpErrorResponse) => {
                if (err.status === 401) {
                    localStorage.clear();
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                }
            }));
        } catch (error) {
            console.log(error);
            // close loader
        }


    }

    settimeout: any;


    checkUrlByApi(url: string) {

        if (url.includes("ivs")) {
            return this.environment.routeApiUrl
        }
        else {
            return this.environment.localApiUrl
        }

    }

}