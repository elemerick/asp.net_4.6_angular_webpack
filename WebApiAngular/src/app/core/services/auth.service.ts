import { Injectable }               from '@angular/core';
import { Observable }               from 'rxjs/Observable';
import { BehaviorSubject }          from 'rxjs/BehaviorSubject';
import { Http, Response, Headers }  from '@angular/http';
import { LOGIN_USER_ENDPOINT }      from '../../shared/api';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { handleError }              from '../../shared/handle-error';

@Injectable()
export class AuthService {
  private jwtHelper: JwtHelper = new JwtHelper();
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public redirectUrl: string; // store the URL so we can redirect after logging in

  constructor(private http: Http) { }

  public login(username: string, password: string): Observable<any> {
    return this.authRequest(username, password, LOGIN_USER_ENDPOINT);
  }

  public logout(): Observable<any> {
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('id_token');
    return Observable.of(true);
  }
  public isLoggedIn() {
    return tokenNotExpired();
  }

  public isLoggedInObs(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable().share();
  }

  public getToken(): string {
    return localStorage.getItem('id_token');
  }

  private authRequest(username: string, password: string, url: string): Observable<boolean> {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let body = `username=${username}&password=${password}&grant_type=password`;

    return this.http.post(url, body, { headers })
                    .map((res: Response) => res.json())
                    .do((data) => {
                      localStorage.setItem('id_token', data.access_token);
                      this.isLoggedInSubject.next(true);
                      let user = this.jwtHelper.decodeToken(data.access_token);
                      return true;
                    })
                    .catch(handleError);
  }

}
