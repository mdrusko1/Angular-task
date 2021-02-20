import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../model/User';
import {catchError} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient,
              private authService: AuthService) {
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.authService.SERVER_URL + '/api/users'}`).pipe(
      catchError(this.handleError)
    );
  }

  addUser(user: { id: number, username: string, firstname: string, lastname: string, password: string, oib: string, country: string }) {
    return this.httpClient.post(`${this.authService.SERVER_URL + '/api/users'}`, user, {
      headers: new HttpHeaders({
        'User:': this.authService.getUserFromSessionStorage()
      })
    });
  }

  deleteUser(userId) {
    return this.httpClient.delete(`${this.authService.SERVER_URL + '/api/users'}/${userId}`, {
      headers: new HttpHeaders({
        'User': this.authService.getUserFromSessionStorage()
      })
    });
  }


  handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}
