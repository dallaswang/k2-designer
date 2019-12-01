import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpRequest, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';

import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { IdentityStorage, IdentityData } from './identity-storage.service';
import { ConfigService } from './auth.config';

import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { joinUrl } from '../../shared/utils';

const client_id = 'iontone';
const client_secret = 'iontone-secret';

@Injectable()
export class AuthenticationService implements AuthService {

  constructor(
  private http: HttpClient,
  private identityStorage: IdentityStorage,
  private config: ConfigService) {
  }

  public isAuthorized(): Observable<boolean> {
    return this.identityStorage
    .getRefreshToken()
    .pipe(
      tap(ev => console.log(!!ev)),
      tap(ev => console.log(ev)),
      map(token =>  !!token)
    );
  }
  public isAutoRegisterUser(): Observable<boolean> {
    return this.identityStorage.getFlag()
    .pipe(
      map(flag => !!(flag && flag.random && flag.random == 1))
    );
  }
  public getAccessToken(): Observable<string> {
    return this.identityStorage.getAccessToken();
  }
  public refreshToken(): Observable<any> {
    const url = joinUrl(this.config.baseUrl, this.config.refreshUrl);
    return this.identityStorage
    .getRefreshToken()
    .pipe(
      switchMap((refreshToken: string) => {
        if (refreshToken == null) {
          console.log('not login');
          this.logout();
          return throwError('');
        }
      const data = 'grant_type=refresh_token&refresh_token=' + refreshToken;
      this.http.post(url, data, {
        headers: new HttpHeaders({
          'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      });
    }),
    tap((tokens: IdentityData) => this.saveIdentity(tokens)),
    catchError((err) => {
      console.log('identityError',err);
      alert('identityError');
      
      this.logout();
      return throwError('');
     // return Observable.throw(err);
    })
    );
  }
  public refreshShouldHappen(response: HttpErrorResponse): boolean {
    return response.status === 401;
  }
  public verifyTokenRequest(url: string): boolean {
    return url.endsWith('/connect/token');
  }

  private saveIdentity(identity: IdentityData) {
    const jwt = jwt_decode(identity.access_token);
    if (jwt && jwt.flag && jwt.flag != '') {
      identity.flag = JSON.parse(jwt.flag);
    } else {
      identity.flag = {};
    }
    this.identityStorage.setIdentity(identity);
  }

  public login(user, req?: HttpRequest<any>): Observable<any> {
    const url = req && req.url ? req.url : joinUrl(this.config.baseUrl, this.config.loginUrl);
    const username = user.username ? user.username : (user.email ? user.email : user.tell);
    const data = 'grant_type=password&username=' + username + '&password=' + user.password + '&scope=api read write offline_access';

    return this.http.post(url, data, {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
    .pipe(
      tap((tokens: IdentityData) => this.saveIdentity(tokens))
    );
  }

  public logout() {
    this.identityStorage.clear();
  }

  public getVerifCode(tell: string) {
    const url = joinUrl(this.config.baseUrl, this.config.sendOTP);
    return this.http.post(url, { identity: tell });
  }
  public validCode(verify: any) {
    const url = joinUrl(this.config.baseUrl, this.config.verifyOTP);
    return this.http.post(url, { identity: verify.tell, otp: verify.code });
  }

  //实名注册或修改资料
  public updateRegistration(user, req?: HttpRequest<any>) {
    const url = req && req.url ? req.url : joinUrl(this.config.baseUrl, this.config.updateRegistrationUrl);
    return this.http.post(url, {
      Username: user.username || user.email,
      Email: user.email,
      FirstName: user.firstName,
      LastName: user.lastName,
      Password: user.password,
      ConfirmPassword: user.confirmPassword,
      Flag: "{\"random\":0}"
    })
    .pipe(
      tap((result: any) => {
        if (result.Success !== false)
          this.login(user).subscribe();
      })
    )
  }
  // 注册
  public signup(user, req?: HttpRequest<any>) {
    const url = req && req.url ? req.url : joinUrl(this.config.baseUrl, this.config.signUrl);
    return this.http.post(url, {
      Username: user.username || user.email,
      Email: user.email,
      FirstName: user.firstName,
      LastName: user.lastName,
      Password: user.password,
      Flag: user.flag
    })
    .pipe(
      tap((result: any) => {
        if (result.Success !== false)
          this.login(user).subscribe();
      })
    )
  }

  public tellSignUp(user, req?: HttpRequest<any>) {
    const url = req && req.url ? req.url : joinUrl(this.config.baseUrl, this.config.signUrl);
    return this.http.post(url, {
      Username: user.username || user.tell,
      PhoneNumber: user.tell,
      OTP: user.code,
      FirstName: user.firstName,
      LastName: user.lastName,
      Password: user.password,
      Flag: user.flag
    })
    .pipe(
      tap((result: any) => {
        if (result.Success !== false)
          this.login(user).subscribe();
      })
    )
  }

  public anonymous() {
    const url = joinUrl(this.config.baseUrl, this.config.loginUrl);
    const data = 'grant_type=client_credentials&scope=api';
    return this.http.post(url, data, {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
  }

  public reset(email: string, req?: HttpRequest<any>) {
    const url = joinUrl(this.config.baseUrl, this.config.forgotUrl);
    return this.http.post(url, {
      email: email
    });
  }

  public identityStatus() {
    return this.identityStorage.identityStatusChanged$;
  }
  public token

  public async getJwtProperty(key) {
    let token = await this.identityStorage.getAccessToken().toPromise();
    if (token) {
      let jwt_object = jwt_decode(token);
      if (jwt_object && jwt_object[key]) {
        return jwt_object[key];
      }
    }
    return null;
  }
}
