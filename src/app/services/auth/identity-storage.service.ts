import { Injectable } from '@angular/core';
import { Observable,Subject, of} from 'rxjs';
const authDataStorage: string = 'auth';

export interface IdentityData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  flag: any;
}

@Injectable()
export class IdentityStorage {
  private identityChangedSource = new Subject<boolean>();
  public identityStatusChanged$ = this.identityChangedSource.asObservable();

  public getAccessToken(): Observable<string> {
    const identity: IdentityData = this.getIdentity();
    return of(identity.access_token);
  }
  public getRefreshToken(): Observable<string> {
    const identity: IdentityData = this.getIdentity();
    return of(identity.refresh_token);
  }
  public getFlag(): Observable<any> {
    const identity : IdentityData = this.getIdentity();
    console.log(identity.flag);
    return of(identity.flag);
  }
  public clear() {
    localStorage.removeItem(authDataStorage);
    this.identityChangedSource.next(false);
  }
  public setIdentity(identity: IdentityData) {
    localStorage.setItem(authDataStorage, JSON.stringify(identity));
    this.identityChangedSource.next(true);
  }
  private getIdentity(): IdentityData {
    var authData: string = localStorage.getItem(authDataStorage);
    const identity: IdentityData = authData ? <IdentityData>JSON.parse(authData) : { access_token: null, refresh_token: null, token_type: null, expires_in: 0, flag: null};
    if (identity.flag) {
      if (typeof identity.flag == "string" && identity.flag != "") {
        identity.flag = JSON.parse(identity.flag);
      }
    } else {
      identity.flag = {};
    }
    return identity;
  }
}
