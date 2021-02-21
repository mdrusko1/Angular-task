import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  SERVER_URL = 'http://localhost:8080';
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

  handleError(error: any) {
    console.error(error);
    return throwError(error);
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
