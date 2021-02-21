import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  SERVER_URL = environment.baseUrl;
  loggedInUser: string;
  refreshingInUserSubject: Subject<string> = new Subject<string>();

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  login(username: string, password: string) {
    return this.httpClient.post(this.SERVER_URL + '/api/login', {
      credentials: {
        username: username,
        password: password
      }
    });
  }

  saveUserSession(user: string) {
    sessionStorage.setItem('user', user);
    this.loggedInUser = user;
    this.refreshingInUserSubject.next(this.loggedInUser);
  }

  removeUserFromSessionStorage() {
    sessionStorage.removeItem('user');
  }

  getUserFromSessionStorage(): string {
    return sessionStorage.getItem('user');
  }

  get getUser(): Observable<string> {
    return this.refreshingInUserSubject.asObservable();
  }

  logout() {
    this.loggedInUser = null;
    this.refreshingInUserSubject.next(null);
    this.removeUserFromSessionStorage();
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('user') !== null;
  }
}
