import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/User';
import {Observable, Subject, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  SERVER_URL = 'http://localhost:8080';
  loggedInUser: string;
  refreshUserSubject: Subject<string> = new Subject<string>();

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  login(username: string, password: string) {
    this.httpClient.post(this.SERVER_URL + '/api/users', {
      credentials: {
        username: username,
        password: password
      }
    }).subscribe(() => {
      this.checkIfUserExist(username, password);
    }, this.handleError);
  }

  saveUserToSessionStorage(user: string) {
    sessionStorage.setItem('user', user);
  }

  removeUserFromSessionStorage() {
    sessionStorage.removeItem('user');
  }

  getUserFromSessionStorage(): string {
    return sessionStorage.getItem('user');
  }

  checkIfUserExist(userName: string, password: string) {
    this.getUsers().subscribe((users: User[]) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.username === userName && user.password === password) {
          console.log('Login success: ', user);
          this.loggedInUser = user.username;
          this.refreshUserSubject.next(this.loggedInUser);
          this.saveUserToSessionStorage(user.username);
          this.router.navigate(['/dashboard']);
        }
      }
      console.log('Cannot find user: ', this.loggedInUser);
      this.refreshUserSubject.next(this.loggedInUser);
    });
  }

  get getUser(): Observable<string> {
    return this.refreshUserSubject.asObservable();
  }

  public getUsers() {
    return this.httpClient.get(this.SERVER_URL + '/api/users');
  }

  public getPolicy(policyId) {
    return this.httpClient.get(`${this.SERVER_URL + 'policies'}/${policyId}`);
  }

  public createPolicy(policy: { id: number, amount: number, clientId: number, userId: number, description: string }) {
    return this.httpClient.post(`${this.SERVER_URL + 'policies'}`, policy);
  }

  public deletePolicy(policyId) {
    return this.httpClient.delete(`${this.SERVER_URL + 'policies'}/${policyId}`);
  }

  public updatePolicy(policy: { id: number, amount: number, clientId: number, userId: number, description: string }) {
    return this.httpClient.put(`${this.SERVER_URL + 'policies'}/${policy.id}`, policy);
  }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
  }

  logout() {
    this.loggedInUser = null;
    this.refreshUserSubject.next(null);
    this.removeUserFromSessionStorage();
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('user') !== null;
  }
}
