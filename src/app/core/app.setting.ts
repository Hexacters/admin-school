import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: "root"
})
export class AppSetting {
    public production = false;

    public localApiUrl = environment.apiUrl + "/ivs/";
    public routeApiUrl = environment.apiUrl;
}