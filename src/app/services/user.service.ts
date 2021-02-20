import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/User';
import {catchError} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.authService.SERVER_URL + '/api/users'}`).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}
