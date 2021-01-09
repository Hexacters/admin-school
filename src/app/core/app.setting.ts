import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AppSetting {
  public production = false;
  public localApiUrl = "http://schoolivs-env.eba-qhze7dp2.us-east-2.elasticbeanstalk.com/ivs/";
  public routeApiUrl = 'http://schoolivs-env.eba-qhze7dp2.us-east-2.elasticbeanstalk.com';
  
}